'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useSupabaseCanvas(canvasId?: string) {
    const [currentCanvasId, setCurrentCanvasId] = useState<string | null>(canvasId || null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    // Tạo canvas mới
    const createCanvas = useCallback(async (title: string = 'Canvas Chưa Đặt Tên') => {
        setIsLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase
                .from('canvases')
                .insert({
                    title,
                    viewport: { x: 0, y: 0, zoom: 1 },
                    settings: { theme: 'light', gridEnabled: true }
                })
                .select()
                .single()

            if (error) throw error

            setCurrentCanvasId(data.id)
            console.log('✅ Canvas created:', data.id)
            return data
        } catch (err) {
            const error = err as Error
            setError(error)
            console.error('❌ Error creating canvas:', error)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Load canvas từ database
    const loadCanvas = useCallback(async (id: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase
                .from('canvases')
                .select('*, canvas_items(*)')
                .eq('id', id)
                .single()

            if (error) throw error

            console.log('✅ Canvas loaded:', data.id, `(${data.canvas_items?.length || 0} items)`)
            return data
        } catch (err) {
            const error = err as Error
            setError(error)
            console.error('❌ Error loading canvas:', error)
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Lưu viewport (vị trí và zoom)
    const saveViewport = useCallback(async (viewport: { x: number; y: number; zoom: number }) => {
        if (!currentCanvasId) return

        try {
            const { error } = await supabase
                .from('canvases')
                .update({ viewport })
                .eq('id', currentCanvasId)

            if (error) throw error
            console.log('✅ Viewport saved')
        } catch (err) {
            console.error('❌ Error saving viewport:', err)
        }
    }, [currentCanvasId])

    // Lưu settings (theme, grid, etc.)
    const saveSettings = useCallback(async (settings: any) => {
        if (!currentCanvasId) return

        try {
            const { error } = await supabase
                .from('canvases')
                .update({ settings })
                .eq('id', currentCanvasId)

            if (error) throw error
            console.log('✅ Settings saved')
        } catch (err) {
            console.error('❌ Error saving settings:', err)
        }
    }, [currentCanvasId])

    // Auto-create canvas on mount nếu chưa có
    useEffect(() => {
        if (!currentCanvasId) {
            createCanvas()
        }
    }, [currentCanvasId, createCanvas])

    return {
        canvasId: currentCanvasId,
        isLoading,
        error,
        createCanvas,
        loadCanvas,
        saveViewport,
        saveSettings
    }
}
