'use client';

import React from 'react';
import { Copy } from 'lucide-react';

interface ArticleData {
    category: string;
    summary: string;
    quick_questions: string[];
}

interface Article {
    original: {
        title: string;
        link: string;
        date?: string;
        image?: string;
    };
    ai_data: ArticleData;
}

interface NewsletterDisplayProps {
    data: Record<string, Article[]>;
}

export default function NewsletterDisplay({ data }: NewsletterDisplayProps) {

    const copyToClipboard = () => {
        const element = document.getElementById('newsletter-content');
        if (element) {
            const html = element.innerHTML;
            navigator.clipboard.writeText(html);
            alert('Đã copy HTML bản tin!');
        }
    };

    return (
        <div className="mt-12 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Preview Bản Tin</h2>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-semibold"
                >
                    <Copy size={18} />
                    Sao chép mã HTML
                </button>
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div id="newsletter-content" className="font-sans text-gray-800 leading-relaxed">

                    {/* HEADER DESIGN */}
                    <div style={{ backgroundColor: '#004aad', padding: '40px 20px', textAlign: 'center', borderRadius: '12px 12px 0 0', marginBottom: '40px' }}>
                        <h1 style={{ color: '#ffffff', fontSize: '28px', textTransform: 'uppercase', margin: 0, fontWeight: '800', letterSpacing: '1px' }}>
                            BẢN TIN CÔNG NGHỆ CIC
                        </h1>
                        <p style={{ color: '#e0e7ff', fontSize: '16px', marginTop: '10px', fontWeight: '500' }}>
                            Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
                        </p>
                    </div>

                    {Object.entries(data).map(([category, articles], index) => (
                        articles.length > 0 && (
                            <div key={category} style={{ marginBottom: '50px' }}>
                                <div style={{ borderLeft: '6px solid #004aad', paddingLeft: '15px', marginBottom: '25px' }}>
                                    <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#004aad', textTransform: 'uppercase', margin: 0 }}>
                                        {category}
                                    </h3>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
                                    {articles.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '20px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                            {item.original.image && (
                                                <div style={{ flexShrink: 0, width: '240px' }}>
                                                    <img src={item.original.image} alt={item.original.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }} />
                                                </div>
                                            )}
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold' }}>
                                                    <a href={item.original.link} target="_blank" style={{ color: '#1e293b', textDecoration: 'none' }}>
                                                        {item.original.title}
                                                    </a>
                                                </h4>
                                                <p style={{ margin: '0 0 15px 0', color: '#475569', fontSize: '15px', lineHeight: '1.6' }}>
                                                    {item.ai_data.summary}
                                                </p>

                                                <div style={{ backgroundColor: '#eff6ff', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                                                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e40af', fontSize: '14px' }}>
                                                        {item.ai_data.quick_questions.map((q, qIndex) => (
                                                            <li key={qIndex} style={{ marginBottom: '4px' }}>{q}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div style={{ marginTop: '15px', textAlign: 'right' }}>
                                                    <a href={item.original.link} style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: '#004aad', color: '#ffffff', textDecoration: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold' }}>
                                                        Đọc tiếp →
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}

                    {/* FOOTER DESIGN */}
                    <div style={{ backgroundColor: '#1e293b', padding: '30px', textAlign: 'center', borderRadius: '0 0 12px 12px', marginTop: '40px' }}>
                        <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '0 0 10px 0' }}>
                            Bản tin này được tạo tự động bởi hệ thống CIC Intelligence.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px' }}>
                            <a href="https://cic.com.vn" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold' }}>Website CIC</a>
                            <span style={{ color: '#64748b' }}>|</span>
                            <a href="#" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold' }}>Liên hệ hỗ trợ</a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
