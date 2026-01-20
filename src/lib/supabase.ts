import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types cho database
export type Canvas = {
    id: string
    title: string
    user_id: string | null
    viewport: {
        x: number
        y: number
        zoom: number
    }
    settings: {
        theme: 'light' | 'dark'
        gridEnabled: boolean
    }
    created_at: string
    updated_at: string
}

export type ItemType =
    | 'freehand'
    | 'rectangle'
    | 'circle'
    | 'arrow'
    | 'line'
    | 'sticky_note'
    | 'text_box'
    | 'image'
    | 'pdf'

export type CanvasItem = {
    id: string
    canvas_id: string
    type: ItemType
    position: {
        x: number
        y: number
    }
    size: {
        width: number
        height: number
    }
    z_index: number
    data: Record<string, any>
    created_at: string
    updated_at: string
}

export type CanvasFile = {
    id: string
    canvas_id: string
    file_name: string
    file_type: string
    file_size: number
    storage_path: string
    created_at: string
}
