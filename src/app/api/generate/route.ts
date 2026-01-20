import { NextResponse } from 'next/server';
import { scrapeCIC, scrapeArticleContent } from '@/lib/scraper';
import { model } from '@/lib/gemini';

// Allowed categories
const CATEGORIES = [
    "Cập nhật phần mềm – dịch vụ",
    "Sự kiện sắp diễn ra",
    "Sự kiện đã diễn ra",
    "Tin thị trường – chính sách",
    "Hướng dẫn – thủ thuật",
    "Tài liệu – báo cáo chuyên sâu"
];

export async function POST() {
    try {
        // 1. Scrape articles (Metadata only)
        console.log("Scraping CIC...");
        const articles = await scrapeCIC();
        console.log(`Found ${articles.length} articles.`);

        // Limit to recent/top articles to avoid timeout during demo
        // In production, we might process all or use a queue.
        const recentArticles = articles.slice(0, 6); // Pick top 6 for speed in this demo

        const processedArticles = [];

        // 2. Process each article with Gemini
        for (const article of recentArticles) {
            console.log(`Processing: ${article.title}`);

            // Fetch content
            const content = await scrapeArticleContent(article.link);

            if (!content || content.length < 50) {
                console.log("Skipping due to empty content");
                continue;
            }

            // Gemini Prompt
            const prompt = `
        Bạn là biên tập viên cho bản tin công nghệ của CIC. Hãy phân tích bài viết dưới đây và trích xuất/tạo các thông tin sau theo định dạng JSON (không dùng markdown code block).
        
        Bài viết:
        Tiêu đề: ${article.title}
        Nội dung: ${content.substring(0, 4000)}

        Yêu cầu đầu ra (JSON):
        {
          "category": "Chọn 1 nhóm phù hợp nhất: Cập nhật phần mềm – dịch vụ / Sự kiện sắp diễn ra / Sự kiện đã diễn ra / Tin thị trường – chính sách / Hướng dẫn – thủ thuật / Tài liệu – báo cáo chuyên sâu",
          "summary": "Tóm tắt 1 đoạn 2-3 câu hấp dẫn.",
          "quick_questions": [
            "Câu 1: Nội dung chính?",
            "Câu 2: Lợi ích?",
            "Câu 3: Tại sao nên đọc?"
          ]
        }
      `;

            try {
                const result = await model.generateContent(prompt);
                let responseText = result.response.text();

                // Clean JSON formatting
                responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

                let data;
                try {
                    data = JSON.parse(responseText);
                } catch (jsonErr) {
                    console.error("JSON Parse Error:", jsonErr, responseText);
                    // Fallback if JSON fails but text exists
                    data = {
                        category: "Khác",
                        summary: responseText.substring(0, 200) + "...", // Use raw text as summary if parsing fails
                        quick_questions: ["Lỗi định dạng AI", "Vui lòng xem chi tiết", "-"]
                    };
                }

                processedArticles.push({
                    original: article,
                    ai_data: data
                });
            } catch (err) {
                console.error("Gemini Critical Error:", err);
                processedArticles.push({
                    original: article,
                    ai_data: {
                        category: "Tin tức chung",
                        summary: "Lỗi kết nối AI: " + (err instanceof Error ? err.message : String(err)),
                        quick_questions: ["-", "-", "-"]
                    }
                });
            }
        }

        // 3. Group by category for the response
        const grouped = CATEGORIES.reduce((acc, cat) => {
            acc[cat] = processedArticles.filter(a => a.ai_data.category === cat);
            return acc;
        }, {} as Record<string, any[]>);

        // Catch-all for others
        grouped["Khác"] = processedArticles.filter(a => !CATEGORIES.includes(a.ai_data.category));

        return NextResponse.json({
            success: true,
            data: grouped,
            raw_count: processedArticles.length
        });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
