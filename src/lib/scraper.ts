import * as cheerio from 'cheerio';
import axios from 'axios';

export interface ScrapedArticle {
    title: string;
    link: string;
    summary?: string;
    date?: string;
    category?: string;
    image?: string;
    content?: string;
}

const BASE_URL = 'https://www.cic.com.vn';

async function fetchHTML(url: string) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        return data;
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        return null;
    }
}

// Updated based on inspection
const CATEGORY_URLS = [
    { url: 'https://www.cic.com.vn/tin-tuc.html', type: 'news' },
    { url: 'https://www.cic.com.vn/su-kien.html', type: 'events' },
    { url: 'https://www.cic.com.vn/tin-chuyen-nganh-cn8.html', type: 'market' },
    { url: 'https://www.cic.com.vn/tin-cong-ty-cn7.html', type: 'company' }
];

export async function scrapeCIC(): Promise<ScrapedArticle[]> {
    const allArticles: ScrapedArticle[] = [];
    const seenLinks = new Set<string>();

    for (const cat of CATEGORY_URLS) {
        const html = await fetchHTML(cat.url);
        if (!html) continue;

        const $ = cheerio.load(html);

        // Based on standard CMS structures and the user's screenshot
        // Look for items that have a date and a "Xem chi tiết" or title structure
        // Common Bootstrap/Portal classes: .item, .news-item, .post, .col-md-*, etc.
        // We'll iterate over generic containers that look like a news item

        // Strategy: Find elements that contain the date format (DD/MM/YYYY)
        // Then find the closest container
        $('*').each((i, el) => {
            const text = $(el).text().trim();
            const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/); // Relaxed regex
            if (dateMatch) {
                // Traverse up to find the main article container (row/item)
                // We look for a container that has both an <a> tag and (optionally) an <img> tag
                let container = $(el).closest('div.row, div.item, li, article, .news-item, .col-md-9');

                // If the closest specific container isn't found, try a generic parent traversal
                if (container.length === 0) {
                    container = $(el).parent().parent().parent();
                }

                // Avoid selecting the date element itself repeatedly or too high up
                if (container.length > 0 && container.find('a').length > 0) {
                    const titleLink = container.find('a[href*=".html"]').first();
                    const title = titleLink.text().trim() || titleLink.attr('title');
                    const link = titleLink.attr('href');

                    // Look for image in the container
                    let image = container.find('img').first().attr('src');

                    // Fallback: sometimes image is in a sibling container (e.g. date is in .col-8, image in .col-4)
                    if (!image) {
                        const row = $(el).closest('.row, .flex, .grid');
                        if (row.length > 0) {
                            image = row.find('img').first().attr('src');
                        }
                    }

                    const textDate = dateMatch[0];

                    if (link && title && title.length > 10) {
                        const fullLink = link.startsWith('http') ? link : `${BASE_URL}${link.startsWith('/') ? '' : '/'}${link}`;

                        // Exclude category pages and unrelated pages
                        const badKeywords = ['tin-tuc.html', 'su-kien.html', 'gioi-thieu', 'lien-he', 'tin-cong-ty', 'tin-chuyen-nganh'];
                        const isBad = badKeywords.some(kw => fullLink.includes(kw));

                        if (!isBad && !seenLinks.has(fullLink)) {
                            console.log("Found Valid Article:", title, fullLink);
                            seenLinks.add(fullLink);

                            // Clean summary
                            const summary = container.text()
                                .replace(textDate, '') // remove date
                                .replace(title || '', '') // remove title
                                .replace(/Xem chi tiết/g, '')
                                .trim()
                                .substring(0, 300);

                            allArticles.push({
                                title,
                                link: fullLink,
                                date: textDate, // The matched date
                                summary: summary.replace(/\s+/g, ' ').trim(),
                                image: image ? (image.startsWith('http') ? image : `${BASE_URL}${image}`) : undefined,
                                category: cat.type
                            });
                        }
                    }
                }
            }
        });
    }

    return allArticles;
}

export async function scrapeArticleContent(url: string): Promise<string> {
    const html = await fetchHTML(url);
    if (!html) return "";
    const $ = cheerio.load(html);

    $('script, style, nav, footer, header').remove();
    // Try to narrow down to the main article body if possible
    const content = $('div.content, div.post-content, div.article-detail, div.main-column, article').text().trim() || $('body').text().trim();

    return content.replace(/\s+/g, ' ');
}
