'use client';

import { useState, useRef } from 'react';
import { Loader2, Search, CheckCircle, Lightbulb, Paperclip, Image as ImageIcon, Link as LinkIcon, X } from 'lucide-react';

export default function SeoCheckPage() {
    const [content, setContent] = useState('');
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [attachments, setAttachments] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                setAttachments(prev => [...prev, {
                    name: file.name,
                    type: 'file',
                    mimeType: file.type,
                    data: event.target?.result
                }]);
            };

            reader.readAsDataURL(file);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleAnalyze = async () => {
        if ((!content.trim() && attachments.length === 0) || !keyword.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/marketing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'seo',
                    content,
                    keyword,
                    attachments
                })
            });
            const json = await res.json();
            if (json.success) {
                setResult(json.data);
            }
        } catch (error) {
            console.error(error);
            alert('Có lỗi phân tích, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
                <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                    <Search />
                </span>
                Trợ Lý SEO Thông Minh
            </h1>
            <p className="text-slate-500 mb-8 ml-12">Phân tích và tối ưu hóa nội dung để đạt thứ hạng cao trên Google.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm transition-colors hover:border-emerald-400">
                        <div className="mb-6">
                            <label className="block text-base font-bold text-slate-900 mb-2">Từ khóa chính (Keyword)</label>
                            <input
                                type="text"
                                className="w-full p-4 border-2 border-slate-300 rounded-xl outline-none focus:border-emerald-600 font-medium text-slate-900 placeholder-slate-500 transition-all"
                                placeholder="Ví dụ: Chuyển đổi số, BIM, CIC..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-base font-bold text-slate-900">Nội dung bài viết</label>

                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        accept="image/*,application/pdf"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold border border-transparent hover:border-emerald-200"
                                        title="Đính kèm file (PDF, Ảnh)"
                                    >
                                        <Paperclip size={16} /> Đính kèm
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <textarea
                                    className="w-full h-80 p-4 border-2 border-slate-300 rounded-xl focus:border-emerald-600 focus:ring-0 outline-none resize-none font-medium text-slate-900 placeholder-slate-500 transition-all"
                                    placeholder="Dán nội dung bài viết cần tối ưu vào đây..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />

                                {attachments.length > 0 && (
                                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                                        {attachments.map((att, idx) => (
                                            <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 shadow-sm animate-in fade-in zoom-in duration-200">
                                                {att.mimeType?.includes('image') ? <ImageIcon size={14} className="text-purple-500" /> : <Paperclip size={14} className="text-red-500" />}
                                                <span className="max-w-[150px] truncate">{att.name}</span>
                                                <button onClick={() => removeAttachment(idx)} className="text-slate-400 hover:text-red-500 ml-1">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading || (!content && attachments.length === 0) || !keyword}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all transform duration-200 ${loading || (!content && attachments.length === 0) || !keyword ? 'bg-slate-300 cursor-not-allowed opacity-70 shadow-none' : 'bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-1 hover:shadow-emerald-900/30'}`}
                        >
                            {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Đang phân tích SEO...</span> : '🚀 Phân Tích & Tối Ưu Ngay'}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-1">
                    {result ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Score Card */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-full h-2 ${result.score >= 80 ? 'bg-emerald-500' : result.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                <h3 className="text-slate-500 text-sm font-semibold uppercase mb-2">Điểm SEO AI</h3>
                                <div className={`text-6xl font-black ${result.score >= 80 ? 'text-emerald-600' : result.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                    {result.score}
                                </div>
                                <p className="text-slate-400 text-sm mt-2">/ 100 điểm</p>
                            </div>

                            {/* Analysis Card */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3 border-b pb-2">
                                    <Lightbulb size={20} className="text-amber-500" /> Nhận xét
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {result.analysis}
                                </p>
                            </div>

                            {/* Suggestions */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3 border-b pb-2">
                                    <CheckCircle size={20} className="text-emerald-500" /> Gợi ý cải thiện
                                </h3>
                                <ul className="space-y-3">
                                    {result.suggestions?.map((s: string, idx: number) => (
                                        <li key={idx} className="flex gap-2 text-sm text-slate-600">
                                            <span className="text-emerald-500 font-bold">•</span>
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Titles */}
                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                                <h3 className="font-bold text-indigo-900 mb-3 text-sm uppercase">Gợi ý tiêu đề chuẩn SEO</h3>
                                <ul className="space-y-3">
                                    {result.optimized_titles?.map((t: string, idx: number) => (
                                        <li key={idx} className="bg-white p-3 rounded border border-indigo-100 text-indigo-700 text-sm font-medium shadow-sm">
                                            {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center placeholder-content">
                            <Search size={48} className="mb-4 text-slate-300" />
                            <p>Nhập nội dung hoặc đính kèm file để xem phân tích</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
