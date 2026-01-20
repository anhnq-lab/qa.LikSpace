'use client';

import { useState } from 'react';
import NewsletterDisplay from '@/components/NewsletterDisplay';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

export default function NewsletterPage() {
    const [loading, setLoading] = useState(false);
    const [newsletterData, setNewsletterData] = useState(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        setNewsletterData(null);

        try {
            const res = await fetch('/api/generate', { method: 'POST' });
            const json = await res.json();

            if (json.success) {
                setNewsletterData(json.data);
            } else {
                setError(json.error || 'Có lỗi xảy ra khi tạo bản tin.');
            }
        } catch (err: any) {
            setError(err.message || 'Lỗi kết nối.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Bản Tin Công Nghệ</h1>
                <p className="text-slate-500 text-lg">Tự động tổng hợp và biên tập tin tức mới nhất từ CIC.</p>
            </header>

            {!newsletterData && (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm max-w-3xl mx-auto">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Sparkles size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Sẵn sàng tạo bản tin tháng {new Date().getMonth() + 1}</h3>
                    <p className="text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
                        Hệ thống sẽ quét website cic.com.vn, phân tích nội dung bằng Gemini AI và tạo bản tin chuyên nghiệp chỉ trong vài phút.
                    </p>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className={`
                    inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white rounded-full transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-500/30
                    ${loading ? 'bg-slate-400 cursor-not-allowed shadow-none hover:translate-y-0' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}
                    `}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Đang phân tích dữ liệu...
                            </>
                        ) : (
                            <>
                                <Sparkles />
                                Bắt đầu Tạo Bản Tin
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center justify-center gap-2 border border-red-100">
                            <AlertCircle size={20} />
                            <span>Lỗi: {error}</span>
                        </div>
                    )}
                </div>
            )}

            {newsletterData && (
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setNewsletterData(null)}
                            className="text-slate-500 hover:text-blue-600 text-sm font-semibold underline"
                        >
                            Tạo bản tin khác
                        </button>
                    </div>
                    <NewsletterDisplay data={newsletterData} />
                </div>
            )}
        </div>
    );
}
