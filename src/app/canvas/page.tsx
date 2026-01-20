'use client'

import { Tldraw, Editor } from 'tldraw'
import 'tldraw/tldraw.css'
import { useCallback } from 'react'
import { useSupabaseCanvas } from './hooks/useSupabaseCanvas'
import { inkspaceOverrides } from './config/inkspace-ui'

export default function CanvasPage() {
    // Connect to Supabase
    const { canvasId, isLoading } = useSupabaseCanvas()

    const handleMount = useCallback((editor: Editor) => {
        // Set canvas settings
        editor.updateInstanceState({
            isGridMode: true, // Bật grid mặc định
        })

        console.log('🎨 InkSpace Canvas mounted! Canvas ID:', canvasId)
    }, [canvasId])

    return (
        <div className="fixed inset-0 bg-white dark:bg-gray-900">
            {/* InkSpace Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            🎨 InkSpace
                        </h1>
                        <span className="text-sm text-gray-500">
                            Canvas vô hạn cho ý tưởng của bạn
                        </span>
                        {canvasId && (
                            <span className="text-xs text-gray-400 font-mono">
                                #{canvasId.slice(0, 8)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang lưu...' : 'Lưu'}
                        </button>
                        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Xuất
                        </button>
                    </div>
                </div>
            </div>

            {/* tldraw Canvas */}
            <div className="absolute top-[57px] left-0 right-0 bottom-0">
                <Tldraw
                    onMount={handleMount}
                    overrides={inkspaceOverrides}
                />
            </div>
        </div>
    )
}
