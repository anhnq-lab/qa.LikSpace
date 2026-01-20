import { TLUiOverrides } from 'tldraw'

// Vietnamese translations for tldraw
export const vietnameseTranslations = {
    // Language metadata
    'language': 'Tiếng Việt',

    // Tools - nội dung
    'tool.select': 'Chọn',
    'tool.draw': 'Vẽ',
    'tool.eraser': 'Tẩy',
    'tool.hand': 'Di chuyển',
    'tool.rectangle': 'Hình chữ nhật',
    'tool.ellipse': 'Hình tròn',
    'tool.arrow': 'Mũi tên',
    'tool.line': 'Đường thẳng',
    'tool.text': 'Văn bản',
    'tool.note': 'Ghi chú',
    'tool.asset': 'Tệp tin',
    'tool.laser': 'Laser',

    // Actions  
    'action.undo': 'Hoàn tác',
    'action.redo': 'Làm lại',
    'action.cut': 'Cắt',
    'action.copy': 'Sao chép',
    'action.paste': 'Dán',
    'action.delete': 'Xóa',
    'action.duplicate': 'Nhân bản',
    'action.select-all': 'Chọn tất cả',
    'action.deselect-all': 'Bỏ chọn',

    // Zoom
    'action.zoom-in': 'Phóng to',
    'action.zoom-out': 'Thu nhỏ',
    'action.zoom-to-100': 'Phóng 100%',
    'action.zoom-to-fit': 'Vừa màn hình',
    'action.zoom-to-selection': 'Phóng to vùng chọn',

    // Edit menu
    'menu.edit': 'Chỉnh sửa',
    'menu.view': 'Xem',
    'menu.preferences': 'Tùy chỉnh',

    // Context menu
    'context-menu.copy-as-png': 'Sao chép dưới dạng PNG',
    'context-menu.copy-as-svg': 'Sao chép dưới dạng SVG',
    'context-menu.copy-as-json': 'Sao chép dưới dạng JSON',

    // Misc
    'page-menu.title': 'Trang',
    'style-panel.title': 'Kiểu',
}

// Custom UI Overrides for InkSpace
export const inkspaceOverrides: TLUiOverrides = {
    // Customize tools order
    tools(editor, tools, { isMobile }) {
        return {
            select: tools.select,
            hand: tools.hand,
            draw: tools.draw,
            eraser: tools.eraser,
            arrow: tools.arrow,
            rectangle: tools.rectangle,
            ellipse: tools.ellipse,
            text: tools.text,
            note: tools.note,
            asset: tools.asset,
        }
    },
}

// InkSpace color palette
export const inkspaceColors = [
    '#1e1e1e', // Đen
    '#e03131', // Đỏ
    '#f59f00', // Cam
    '#fab005', // Vàng
    '#82c91e', // Xanh lá
    '#20c997', // Xanh lục
    '#339af0', // Xanh dương
    '#7950f2', // Tím
    '#e64980', // Hồng
    '#868e96', // Xám
    '#ffffff', // Trắng
]
