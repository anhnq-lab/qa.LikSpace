'use client';

import { useState } from 'react';
import { Loader2, Palette, Layout, Layers, Download, Copy, CheckCircle } from 'lucide-react';

export default function InfographicPage() {
    const [topic, setTopic] = useState('');
    const [dataPoints, setDataPoints] = useState('');
    const [style, setStyle] = useState('Hiện đại, Phẳng (Flat Design)');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        setResult('');

        try {
            const res = await fetch('/api/marketing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'infographic',
                    content: topic, // Using content field for topic
                    dataPoints,
                    style
                })
            });
            const json = await res.json();
            if (json.success) {
                setResult(json.data);
            }
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
                <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-2 rounded-lg shadow-md">
                    <Palette size={24} />
                </span>
                Thiết Kế Ý Tưởng Infographic
            </h1>
            <p className="text-slate-500 mb-8 ml-12">Biến dữ liệu phức tạp thành bản kế hoạch thiết kế trực quan, hấp dẫn.</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Chủ đề / Tiêu đề chính</label>
                            <input
                                type="text"
                                className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-rose-500 font-medium text-slate-800 transition-all placeholder:font-normal"
                                placeholder="VD: Quy trình Chuyển đổi số 2026..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Dữ liệu / Ý chính (Data Points)</label>
                            <textarea
                                className="w-full h-40 p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-rose-500 font-medium text-slate-800 transition-all resize-none placeholder:font-normal"
                                placeholder="Nhập các số liệu, bước thực hiện hoặc nội dung cần thể hiện..."
                                value={dataPoints}
                                onChange={(e) => setDataPoints(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Phong cách thiết kế</label>
                            <select
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-rose-500 font-medium text-slate-800 bg-white"
                            >
                                <option value="Hiện đại, Phẳng (Flat Design)">🟦 Hiện đại, Phẳng (Flat)</option>
                                <option value="Corporate, Chuyên nghiệp (B2B)">💼 Professional (B2B)</option>
                                <option value="Vui nhộn, Minh họa (Playful)">🎨 Vui nhộn, Minh họa</option>
                                <option value="Tối giản (Minimalist)">⚪ Tối giản (Minimalist)</option>
                                <option value="Isometric 3D">📦 Isometric 3D</option>
                            </select>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !topic}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${loading || !topic ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-rose-500/30'}`}
                        >
                            {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Đang phác thảo...</span> : '✨ Tạo Bản Mô Tả Thiết Kế'}
                        </button>
                    </div>
                </div>

                {/* Output Preview */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full min-h-[600px] flex flex-col relative overflow-hidden">

                        {/* Header */}
                        <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-slate-600 font-semibold">
                                <Layout size={18} /> Bản Mô Tả Chi Tiết (Design Brief)
                            </div>
                            {result && (
                                <button
                                    onClick={handleCopy}
                                    className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all shadow-sm flex items-center gap-2 text-xs font-bold"
                                >
                                    {copied ? <CheckCircle className="text-emerald-500" size={16} /> : <Copy size={16} />}
                                    {copied ? 'Đã sao chép' : 'Sao chép'}
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-8 flex-1 overflow-auto bg-dot-pattern">
                            {result ? (
                                <div className="prose prose-slate max-w-none text-slate-800 whitespace-pre-wrap leading-relaxed">
                                    {result}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                                    <Layers size={64} className="mb-4 text-slate-300" />
                                    <p className="text-lg font-medium">Sẵn sàng thiết kế infographic của bạn</p>
                                    <p className="text-sm">Nhập chủ đề và dữ liệu để bắt đầu</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
