import Link from 'next/link';
import { Newspaper, PenTool, Mail, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const tools = [
    {
      href: '/newsletter',
      icon: Newspaper,
      title: 'Bản Tin Công Nghệ',
      desc: 'Tự động cào tin, phân loại và tóm tắt tin tức CIC.',
      color: 'bg-blue-500'
    },
    {
      href: '/social-post',
      icon: PenTool,
      title: 'Tạo Bài Viết Social',
      desc: 'Viết caption Facebook/LinkedIn từ link bài viết.',
      color: 'bg-purple-500'
    },
    {
      href: '/email-drafter',
      icon: Mail,
      title: 'Soạn Thảo Email',
      desc: 'Hỗ trợ viết email marketing chuyên nghiệp.',
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="p-10">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Xin chào, Admin CIC 👋</h1>
        <p className="text-xl text-slate-500">Bạn muốn tự động hóa nội dung gì hôm nay?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300"
            >
              <div className={`w-14 h-14 ${tool.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                <Icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">{tool.title}</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                {tool.desc}
              </p>
              <div className="flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
                Truy cập tool <ArrowRight size={18} className="ml-2" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 bg-indigo-900 rounded-3xl p-10 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Trợ lý AI Thông Minh</h2>
          <p className="text-indigo-200 mb-8 text-lg">
            Cần ý tưởng content mới? Hay muốn phân tích dữ liệu website? Chat ngay với trợ lý ảo được tích hợp sâu vào dữ liệu CIC.
          </p>
          <button className="px-8 py-3 bg-white text-indigo-900 font-bold rounded-full hover:bg-indigo-50 transition-colors">
            Chat Ngay
          </button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Newspaper size={300} />
        </div>
      </div>
    </div>
  );
}
