const fs = require('fs');
const path = require('path');

// Cấu hình bản đồ Loại văn bản
const MAP_TYPE = {
    'nghị định': 'ND',
    'thông tư': 'TT',
    'quyết định': 'QD',
    'luật': 'Luat',
    'nghị quyết': 'NQ',
    'chỉ thị': 'CT',
    'công văn': 'CV',
    'tờ trình': 'TTr',
    'báo cáo': 'BC',
    'hợp đồng': 'HD',
    'phụ lục': 'PL',
    'quy chuẩn': 'QCVN',
    'tiêu chuẩn': 'TCVN',
    'thông báo': 'TB'
};

// Cấu hình bản đồ Lĩnh vực (theo hệ thống pháp luật VN + Custom)
const MAP_FIELD = {
    'hiến pháp': 'HP',
    'hành chính': 'HC',
    'dân sự': 'DS',
    'hình sự': 'HS',
    'xây dựng': 'XD', 'công trình': 'XD',
    'đất đai': 'DD', 'nhà ở': 'DD', 'bất động sản': 'DD',
    'đầu tư công': 'DTC', 'ngân sách': 'TC',
    'đầu tư': 'Dtu',
    'đấu thầu': 'DT', 'mua sắm': 'DT',
    'quy hoạch': 'QH', 'kiến trúc': 'QH',
    'tài chính': 'TC', 'thuế': 'TC',
    'thương mại': 'TM',
    'môi trường': 'MT', 'khoáng sản': 'MT',
    'giao thông': 'GT', 'vận tải': 'GT',
    'lao động': 'LD', 'tiền lương': 'LD',
    'phòng cháy': 'PCCC', 'cứu nạn': 'PCCC', 'pccc': 'PCCC',
    'giáo dục': 'GD',
    'y tế': 'YT'
};

// Hàm xóa dấu tiếng Việt
function removeVietnameseTones(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|;|'| |\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str.trim();
}

// Hàm chuẩn hóa tên file string "This is a Test" -> "ThisIsATest" hoặc "this_is_a_test"
// Ở đây ta dùng snake_case cho clean
function slugify(text) {
    return removeVietnameseTones(text).replace(/\s+/g, '_'); // thay khoảng trắng bằng _
}

function parseFilename(filename) {
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext);
    const lowerName = baseName.toLowerCase();

    // 1. Tìm Năm (4 chữ số, ưu tiên 20xx hoặc 19xx)
    const yearMatch = baseName.match(/(20\d{2}|19\d{2})/);
    const year = yearMatch ? yearMatch[0] : '0000'; // 0000 nếu không tìm thấy

    // 2. Tìm Loại văn bản
    let type = 'VB'; // Mặc định
    for (const [key, val] of Object.entries(MAP_TYPE)) {
        if (lowerName.includes(key)) {
            type = val;
            break;
        }
    }

    // 3. Tìm Lĩnh vực
    let field = 'K'; // Mặc định Khác
    for (const [key, val] of Object.entries(MAP_FIELD)) {
        if (lowerName.includes(key)) {
            field = val;
            break; // Lấy lĩnh vực đầu tiên tìm thấy
        }
    }

    // 4. Tìm Số hiệu (Đơn giản hóa: tìm chuỗi số đứng cạnh ký tự / hoặc - hoặc độc lập)
    // VD: 134/2020 -> 134, Số 01 -> 01
    // Logic này tương đối, cần check lại bằng mắt
    // Thường số hiệu hay đứng đầu hoặc sau chữ "số"
    let number = 'NoNum';
    const numMatch = lowerName.match(/(?:số|no\.?|nq|nđ|tt|qđ|luật)[^\d]*(\d+)/) || baseName.match(/(\d+)/);
    // Regex trên cố gắng tìm số sau các từ khóa, nếu không thấy thì lấy số đầu tiên tìm được
    if (numMatch) {
        number = numMatch[1];
    }

    // Nếu số trùng năm (do match nhầm) thì bỏ qua
    if (number === year) {
        number = 'NoNum';
        // Thử tìm số khác
        const otherNums = baseName.match(/\d+/g);
        if (otherNums) {
            const found = otherNums.find(n => n !== year);
            if (found) number = found;
        }
    }

    // 5. Nội dung rút gọn (Lấy 3-4 từ đầu tiên của tên file gốc sau khi đã clean)
    // Để an toàn, ta giữ lại tên gốc đã slugify nhưng bỏ đi các phần đã định danh (năm, số..) để tránh lặp
    // Tuy nhiên đơn giản nhất là cứ append tên gốc slugify vào cuối, người dùng tự sửa ngắn lại sau
    let content = slugify(baseName);

    // Loại bỏ các từ khóa nhiễu khỏi content để tên ngắn hơn
    const stopWords = [...Object.keys(MAP_TYPE), ...Object.keys(MAP_FIELD), year, number, 'số', 'của', 'về', 'việc', 'ban', 'hành'];
    stopWords.forEach(word => {
        content = content.replace(new RegExp(removeVietnameseTones(word), 'gi'), '');
    });
    content = content.replace(/_+/g, '_').replace(/^_|_$/g, ''); // Fix double underscore

    if (content.length > 50) content = content.substring(0, 50); // Cắt ngắn nếu quá dài

    return { year, type, field, number, content, ext };
}

function processDirectory(dir, apply = false) {
    if (!fs.existsSync(dir)) {
        console.error(`Thư mục không tồn tại: ${dir}`);
        return;
    }

    const files = fs.readdirSync(dir);
    const renameMap = [];

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isFile()) {
            const parsed = parseFilename(file);

            // FORMULA: [Năm]_[Loại]_[LĩnhVực]_[Số]_[NộiDung].ext
            // Nếu không tìm thấy số, bỏ qua field số
            let newName = `${parsed.year}_${parsed.type}_${parsed.field}`;
            if (parsed.number !== 'NoNum') newName += `_${parsed.number}`;
            if (parsed.content) newName += `_${parsed.content}`;
            newName += parsed.ext;

            renameMap.push({
                oldName: file,
                newName: newName,
                path: fullPath
            });
        }
    });

    // In kết quả
    const previewPath = path.join(__dirname, 'rename_preview.json');
    fs.writeFileSync(previewPath, JSON.stringify(renameMap, null, 2));
    console.log(`Đã tạo file xem trước tại: ${previewPath}`);
    console.log(`Tổng số file tìm thấy: ${renameMap.length}`);

    if (apply) {
        console.log('--- BẮT ĐẦU ĐỔI TÊN ---');
        renameMap.forEach(item => {
            if (item.oldName !== path.basename(item.newName)) { // Chỉ đổi nếu tên khác nhau
                try {
                    const newPath = path.join(path.dirname(item.path), item.newName);
                    if (fs.existsSync(newPath)) {
                        console.error(`[SKIP] File đã tồn tại: ${item.newName}`);
                    } else {
                        fs.renameSync(item.path, newPath);
                        console.log(`[OK] ${item.oldName} -> ${item.newName}`);
                    }
                } catch (e) {
                    console.error(`[ERR] Lỗi đổi tên ${item.oldName}: ${e.message}`);
                }
            }
        });
        console.log('--- HOÀN TẤT ---');
    } else {
        console.log('CHẾ ĐỘ XEM TRƯỚC (DRY RUN). Sử dụng tùy chọn --apply để thực hiện đổi tên.');
    }
}

// Main execution
const args = process.argv.slice(2);
const dirArg = args[0]; // Argument đầu tiên là đường dẫn thư mục
const modeArg = args[1]; // Argument thứ 2 (optional) --apply

if (!dirArg) {
    console.log("Cách dùng: node file_renamer.js <đường_dẫn_thư_mục> [--apply]");
} else {
    console.log(`Đang quét thư mục: ${dirArg}`);
    processDirectory(dirArg, modeArg === '--apply');
}
