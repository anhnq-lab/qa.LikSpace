'use client';

import { useState } from 'react';
import { Loader2, Mic, Headphones, Music, User, Users, PlayCircle, Copy, CheckCircle } from 'lucide-react';

export default function PodcastPage() {
    const [topic, setTopic] = useState('');
    const [format, setFormat] = useState('Solo Host (Kể chuyện)');
    const [duration, setDuration] = useState('5 phút');
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
                    type: 'podcast',
                    content: topic,
                    podcastFormat: format,
                    duration
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
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-2 rounded-lg shadow-md">
                    <Mic size={24} />
                </span>
                Kịch Bản Podcast PRO
            </h1>
            <p className="text-slate-500 mb-8 ml-12">Tạo kịch bản âm thanh sống động, chuyên nghiệp chỉ trong vài giây.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Chủ đề / Nguồn nội dung</label>
                            <textarea
                                className="w-full h-40 p-4 border-2 border-slate-200 rounded-xl outline-none focus:border-violet-500 font-medium text-slate-800 transition-all resize-none placeholder:font-normal"
                                placeholder="Nhập chủ đề hoặc dán nội dung bài viết gốc vào đây..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Định dạng (Format)</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setFormat('Solo Host (Kể chuyện)')}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 text-sm font-bold transition-all ${format === 'Solo Host (Kể chuyện)' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <User size={24} /> Solo (Host)
                                </button>
                                <button
                                    onClick={() => setFormat('Phỏng vấn (Interview)')}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 text-sm font-bold transition-all ${format === 'Phỏng vấn (Interview)' ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <Users size={24} /> Interview
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Thời lượng dự kiến</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none focus:border-violet-500 font-medium text-slate-800 bg-white"
                            >
                                <option value="3 phút">Ngắn (3 phút)</option>
                                <option value="5 phút">Tiêu chuẩn (5 phút)</option>
                                <option value="10 phút">Chuyên sâu (10 phút)</option>
                                <option value="20 phút">Review chi tiết (20 phút)</option>
                            </select>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !topic}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${loading || !topic ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-violet-600 to-indigo-700 hover:shadow-violet-500/30'}`}
                        >
                            {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Đang viết kịch bản...</span> : '🎙️ Tạo Kịch Bản'}
                        </button>
                    </div>
                </div>

                {/* Output Script */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full min-h-[600px] flex flex-col relative overflow-hidden">

                        {/* Header */}
                        <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2 text-slate-600 font-semibold">
                                <Headphones size={18} /> Kịch Bản Chi Tiết
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

                        {/* Script Content */}
                        <div className="p-8 flex-1 overflow-auto font-mono text-sm leading-relaxed bg-slate-50/50">
                            {result ? (
                                <div className="whitespace-pre-wrap text-slate-800">
                                    {result}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                                    <Music size={64} className="mb-4 text-slate-300" />
                                    <p className="text-lg font-medium">Phòng thu ảo đang chờ bạn</p>
                                    <p className="text-sm">Nhập nội dung để AI hóa thân thành Producer</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
