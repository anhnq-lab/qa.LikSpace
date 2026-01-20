'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Newspaper,
    LayoutDashboard,
    PenTool,
    Mail,
    Settings,
    Bot,
    MessageSquare,
    Search
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/newsletter', icon: Newspaper, label: 'Bản tin công nghệ' },
        { href: '/social-post', icon: PenTool, label: 'Bài viết Social' },
        { href: '/seo-check', icon: Search, label: 'Trợ lý SEO' },
        { href: '/email-drafter', icon: Mail, label: 'Soạn Email' },
    ];

    const bottomItems = [
        { href: '/settings', icon: Settings, label: 'Cài đặt' },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800">
            {/* Header */}
            <div className="p-6 flex items-center gap-3 border-b border-slate-800">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <Bot size={20} />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">CIC Tools</h1>
            </div>

            {/* Main Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-500 uppercase px-3 mb-2">Công cụ</div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'hover:bg-slate-800 hover:text-white'
                                }
              `}
                        >
                            <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}

                <div className="mt-8 text-xs font-semibold text-slate-500 uppercase px-3 mb-2">Hỗ trợ</div>
                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-800 hover:text-white text-left transition-colors">
                    <MessageSquare size={20} className="text-slate-400" />
                    <span className="font-medium">Hỏi AI Trợ Lý</span>
                </button>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
                {bottomItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <Icon size={20} className="text-slate-400" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}
                <div className="mt-4 flex items-center gap-3 px-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                        AD
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">Admin CIC</span>
                        <span className="text-xs text-slate-500">Premium Plan</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
