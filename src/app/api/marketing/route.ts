
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from 'next/server';
import { model } from '@/lib/gemini';

export async function POST(req: NextRequest) {
    try {
        const { type, content, platform, tone, keyword, attachments = [] } = await req.json();

        let systemInstruction = "";
        let promptText = "";

        if (type === 'social') {
            systemInstruction = "Bạn là một chuyên gia Content Marketing.";
            promptText = `
                Hãy viết một bài đăng mạng xã hội cho nền tảng ${platform} (ví dụ: Facebook, LinkedIn, Zalo) dựa trên nội dung và hình ảnh (nếu có) được cung cấp.
                
                Nội dung gốc: "${content}"

                Yêu cầu:
                - Văn phong: ${tone}.
                - Bắt đầu bằng một câu Hook thu hút.
                - Sử dụng emoji hợp lý.
                - Kết thúc bằng Call to Action (CTA).
                - Thêm 3-5 hashtag liên quan.
            `;
        } else if (type === 'seo') {
            systemInstruction = "Bạn là một chuyên gia SEO hàng đầu.";
            promptText = `
                Hãy phân tích nội dung (văn bản và file đính kèm nếu có) cho từ khóa chính: "${keyword}".
                
                Nội dung văn bản: "${content}"

                Hãy trả về kết quả dưới dạng RAW JSON với cấu trúc sau (KHÔNG dùng markdown):
                {
                    "score": number, 
                    "analysis": "Nhận xét tổng quan ngắn gọn",
                    "suggestions": ["Gợi ý 1", "Gợi ý 2", "Gợi ý 3"],
                    "optimized_titles": ["Tiêu đề gợi ý 1", "Tiêu đề gợi ý 2", "Tiêu đề gợi ý 3"],
                    "meta_description": "Đoạn meta description chuẩn SEO"
                }
            `;
        } else {
            // ... existing email logic or others
            promptText = content;
        }

        // Prepare parts for Gemini
        const parts: any[] = [
            { text: systemInstruction + "\n\n" + promptText }
        ];

        // Add attachments (Images/PDFs)
        if (attachments && Array.isArray(attachments)) {
            attachments.forEach((att: any) => {
                if (att.data && att.mimeType) {
                    // Remove header like "data:image/png;base64," if present for the API call 
                    // (But generally google-generative-ai expects the raw base64 string without header for inlineData?)
                    // Actually, the SDK inlineData expects the base64 string, usually without the data URI prefix.
                    const base64Data = att.data.split(',')[1] || att.data;
                    parts.push({
                        inlineData: {
                            data: base64Data,
                            mimeType: att.mimeType
                        }
                    });
                }
            });
        }

        const result = await model.generateContent(parts);
        let responseText = result.response.text();

        // Data cleaning for JSON output
        if (type === 'seo') {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            try {
                const jsonResponse = JSON.parse(responseText);
                return NextResponse.json({ success: true, data: jsonResponse });
            } catch (e) {
                return NextResponse.json({ success: true, data: { raw: responseText }, warning: "Failed to parse JSON" });
            }
        }

        return NextResponse.json({ success: true, data: responseText });

    } catch (error: any) {
        console.error("Marketing API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
