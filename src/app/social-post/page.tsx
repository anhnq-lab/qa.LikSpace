'use client';

import { useState, useRef } from 'react';
import { Loader2, Facebook, Linkedin, MessageCircle, Copy, CheckCircle, Paperclip, Image as ImageIcon, X } from 'lucide-react';

export default function SocialPostPage() {
    const [content, setContent] = useState('');
    const [platform, setPlatform] = useState('Facebook');
    const [tone, setTone] = useState('Vui vẻ, Viral');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);
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

    const handleGenerate = async () => {
        if (!content.trim() && attachments.length === 0) return;
        setLoading(true);
        setResult('');
        setCopied(false);

        try {
            const res = await fetch('/api/marketing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'social',
                    content,
                    platform,
                    tone,
                    attachments
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
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-6 flex items-center gap-3">
                <span className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                    {platform === 'Facebook' && <Facebook />}
                    {platform === 'LinkedIn' && <Linkedin />}
                    {platform === 'Zalo' && <MessageCircle />}
                </span>
                Tạo Bài Viết Social
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm transition-colors hover:border-purple-400">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-base font-bold text-slate-900">Nội dung gốc / Link bài viết</label>
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
                                    className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-all flex items-center gap-2 text-sm font-bold border border-purple-200"
                                >
                                    <Paperclip size={16} /> Đính kèm
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <textarea
                                className="w-full h-40 p-4 border-2 border-slate-300 rounded-xl focus:border-purple-600 focus:ring-0 outline-none resize-none font-medium text-slate-900 placeholder-slate-500 transition-all"
                                placeholder="Dán link bài viết hoặc tóm tắt nội dung bạn muốn đăng..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />

                            {/* Attachment List */}
                            {attachments.length > 0 && (
                                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                                    {attachments.map((att, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-2 py-1 rounded-lg text-xs font-medium text-purple-700 shadow-sm animate-in fade-in zoom-in duration-200">
                                            <ImageIcon size={12} />
                                            <span className="max-w-[100px] truncate">{att.name}</span>
                                            <button onClick={() => removeAttachment(idx)} className="hover:text-red-500">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                        <div>
                            <label className="block text-base font-bold text-slate-900 mb-2">Nền tảng</label>
                            <div className="flex gap-2">
                                {['Facebook', 'LinkedIn', 'Zalo'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPlatform(p)}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${platform === p ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-base font-bold text-slate-900 mb-2">Văn phong (Tone)</label>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full p-3 border-2 border-slate-300 rounded-xl outline-none focus:border-purple-600 font-medium text-slate-900 appearance-none bg-white"
                            >
                                <option value="Vui vẻ, Viral">😄 Vui vẻ, Bắt trend (Viral)</option>
                                <option value="Chuyên nghiệp, Chuyên gia">👔 Chuyên nghiệp (LinkedIn style)</option>
                                <option value="Thân thiện, Chia sẻ">🤝 Thân thiện, Chia sẻ</option>
                                <option value="Bán hàng, Kêu gọi hành động">🛒 Bán hàng (Sales)</option>
                            </select>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || (!content && attachments.length === 0)}
                            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${loading || (!content && attachments.length === 0) ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-purple-600 hover:bg-purple-700'}`}
                        >
                            {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Đang viết content...</span> : '✨ Tạo Bài Viết Ngay'}
                        </button>
                    </div>
                </div>

                {/* Output Section */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative min-h-[500px] flex flex-col">
                    <h3 className="text-lg font-bold text-slate-700 mb-4">Kết quả AI</h3>

                    {result ? (
                        <div className="flex-1 whitespace-pre-wrap text-slate-800 leading-relaxed font-medium">
                            {result}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                                <Facebook className="text-slate-400" size={32} />
                            </div>
                            <p>Nội dung bài đăng sẽ hiển thị ở đây</p>
                        </div>
                    )}

                    {result && (
                        <button
                            onClick={handleCopy}
                            className="absolute top-6 right-6 p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 transition-all shadow-sm"
                            title="Copy content"
                        >
                            {copied ? <CheckCircle className="text-green-500" size={20} /> : <Copy size={20} />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
