-- InkSpace Database Schema
-- Tạo các tables cho canvas, items, và files

-- 1. Bảng canvases - Lưu các canvas chính
CREATE TABLE IF NOT EXISTS canvases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Canvas Chưa Đặt Tên',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  viewport JSONB NOT NULL DEFAULT '{"x": 0, "y": 0, "zoom": 1}',
  settings JSONB NOT NULL DEFAULT '{"theme": "light", "gridEnabled": true}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index cho queries nhanh
CREATE INDEX IF NOT EXISTS idx_canvases_user_id ON canvases(user_id);
CREATE INDEX IF NOT EXISTS idx_canvases_updated_at ON canvases(updated_at DESC);

-- Trigger tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_canvases_updated_at
  BEFORE UPDATE ON canvases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 2. Enum cho loại items
DO $$ BEGIN
  CREATE TYPE item_type AS ENUM (
    'freehand',
    'rectangle',
    'circle',
    'arrow',
    'line',
    'sticky_note',
    'text_box',
    'image',
    'pdf'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Bảng canvas_items - Lưu tất cả objects trên canvas
CREATE TABLE IF NOT EXISTS canvas_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id UUID NOT NULL REFERENCES canvases(id) ON DELETE CASCADE,
  type item_type NOT NULL,
  position JSONB NOT NULL,
  size JSONB NOT NULL,
  z_index INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes cho canvas_items
CREATE INDEX IF NOT EXISTS idx_canvas_items_canvas_id ON canvas_items(canvas_id);
CREATE INDEX IF NOT EXISTS idx_canvas_items_type ON canvas_items(type);
CREATE INDEX IF NOT EXISTS idx_canvas_items_z_index ON canvas_items(z_index);

-- Trigger tự động cập nhật updated_at cho canvas_items
CREATE TRIGGER update_canvas_items_updated_at
  BEFORE UPDATE ON canvas_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. Bảng canvas_files - Metadata cho uploaded files
CREATE TABLE IF NOT EXISTS canvas_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id UUID NOT NULL REFERENCES canvases(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index cho canvas_files
CREATE INDEX IF NOT EXISTS idx_canvas_files_canvas_id ON canvas_files(canvas_id);

-- 5. Row Level Security (RLS)
ALTER TABLE canvases ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_files ENABLE ROW LEVEL SECURITY;

-- Policies cho MVP (cho phép tất cả - chưa có auth)
DROP POLICY IF EXISTS "Allow all for MVP" ON canvases;
CREATE POLICY "Allow all for MVP" ON canvases
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for MVP" ON canvas_items;
CREATE POLICY "Allow all for MVP" ON canvas_items
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for MVP" ON canvas_files;
CREATE POLICY "Allow all for MVP" ON canvas_files
  FOR ALL USING (true) WITH CHECK (true);

-- 6. Storage bucket cho files (run riêng trong Supabase Dashboard -> Storage)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('canvas-files', 'canvas-files', true)
-- ON CONFLICT DO NOTHING;
