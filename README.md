# 🎨 InkSpace - Canvas Ghi Chú Vô Hạn

Canvas vô hạn kết hợp vẽ tự do, ghi chú phong phú và tìm kiếm thông minh - được hỗ trợ bởi AI.

## ✨ Tính Năng

### MVP (Phase 1)
- ✍️ **Canvas Vô Hạn** - Pan, zoom, không giới hạn
- 🎨 **Công Cụ Vẽ** - Vẽ tự do, shapes, màu sắc tùy chỉnh
- 📝 **Ghi Chú** - Sticky notes và text boxes với rich editing
- 📁 **Import Files** - Kéo thả ảnh và PDFs
- 🔍 **Tìm Kiếm** - Tìm kiếm nhanh trong tất cả ghi chú
- 💾 **Lưu Tự Động** - Đồng bộ vào Supabase mỗi 30 giây
- 🌓 **Dark Mode** - Chuyển đổi theme linh hoạt
- 📱 **Mobile Friendly** - Hỗ trợ touch gestures

### Coming Soon (Phase 2)
- 🤖 **AI Search** - Tìm kiếm ngữ nghĩa
- 📊 **Knowledge Graph** - Kết nối giữa các ghi chú  
- 🎤 **Voice Notes** - Ghi âm và transcribe
- 👥 **Real-time Collaboration** - Làm việc cùng nhau

## 🚀 Setup

### 1. Cài Đặt Dependencies

```bash
npm install
```

### 2. Cấu Hình Environment Variables

Tạo file `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database

Chạy migration trong Supabase SQL Editor:

```bash
# Copy nội dung từ supabase/migrations/001_init_inkspace.sql
# Paste vào Supabase Dashboard > SQL Editor > Run
```

### 4. Tạo Storage Bucket

Trong Supabase Dashboard > Storage:
1. Tạo bucket mới tên `canvas-files`
2. Set thành Public
3. Thêm policy "Allow all for MVP"

### 5. Chạy Dev Server

```bash
npm run dev
```

Mở [http://localhost:3000/canvas](http://localhost:3000/canvas)

## 📁 Cấu Trúc Thư Mục

```
src/
├── app/
│   └── canvas/
│       ├── page.tsx              # Main canvas page
│       ├── components/           # Canvas components
│       │   ├── InfiniteCanvas.tsx
│       │   ├── CanvasToolbar.tsx
│       │   ├── StickyNote.tsx
│       │   ├── TextBox.tsx
│       │   ├── SearchBar.tsx
│       │   └── ...
│       ├── hooks/                # Custom hooks
│       │   ├── useSupabaseCanvas.ts
│       │   ├── useSearch.ts
│       │   └── ...
│       └── tools/                # Drawing tools
│           └── DrawingTools.tsx
├── lib/
│   └── supabase.ts              # Supabase client
└── ...
```

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 + React + TypeScript
- **Canvas Engine:** tldraw SDK
- **Rich Text:** TipTap
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI

## 📝 Database Schema

### `canvases`
- Lưu canvas settings, viewport, title
- JSONB cho viewport & settings

### `canvas_items`
- Lưu tất cả objects (drawings, notes, shapes, files)
- Polymorphic design với JSONB data

### `canvas_files`
- Metadata cho uploaded files
- Reference đến Supabase Storage

## ⌨️ Phím Tắt

- `Ctrl/Cmd + Z` - Hoàn tác
- `Ctrl/Cmd + Shift + Z` - Làm lại
- `Ctrl/Cmd + S` - Lưu
- `Ctrl/Cmd + K` - Tìm kiếm
- `Delete` - Xóa items đã chọn
- `Ctrl/Cmd + D` - Nhân bản
- `Space + Kéo` - Pan canvas
- `Ctrl/Cmd + Scroll` - Zoom

## 📊 Development Progress

- ✅ Setup project & Supabase
- ✅ Database schema
- ✅ Folder structure
- ⏳ Canvas core (In Progress)
- ⏳ Drawing tools
- ⏳ Notes system
- ⏳ File import
- ⏳ Search
- ⏳ Supabase integration
- ⏳ UI/UX polish
- ⏳ Testing

## 📄 License

MIT

---

**Built with ❤️ using InkSpace**
