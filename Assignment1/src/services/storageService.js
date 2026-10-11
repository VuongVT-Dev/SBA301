// FUNewsManagementSystem - Storage Service
// Quản lý persistence qua localStorage và khởi tạo mock data ban đầu

const STORAGE_KEYS = {
  CATEGORIES: 'funews_categories',
  NEWS: 'funews_news',
  USERS: 'funews_users',
  SESSION: 'funews_session',
};

// Dữ liệu mẫu ban đầu theo nghiệp vụ báo chí FUNews
export const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Thế giới', description: 'Tin tức quốc tế, thời sự, ngoại giao và các sự kiện toàn cầu', status: 1, createdAt: '2026-10-01' },
  { id: 2, name: 'Công nghệ', description: 'Trí tuệ nhân tạo, thiết bị số, an ninh mạng và chuyển đổi số', status: 1, createdAt: '2026-10-02' },
  { id: 3, name: 'Kinh doanh', description: 'Thị trường tài chính, khởi nghiệp số, thương mại điện tử', status: 1, createdAt: '2026-10-03' },
  { id: 4, name: 'Giáo dục', description: 'Tuyển sinh, đào tạo đại học, học bổng và công nghệ giáo dục', status: 1, createdAt: '2026-10-04' },
  { id: 5, name: 'Giải trí', description: 'Nghệ thuật đương đại, điện ảnh, âm nhạc và văn hóa giới trẻ', status: 0, createdAt: '2026-10-05' },
];

export const DEFAULT_USERS = [
  { id: 1, username: 'Admin', fullName: 'Hệ thống Quản trị viên', email: 'admin@funews.edu.vn', role: 1, status: 1, createdAt: '2026-09-01' },
  { id: 2, username: 'Staff', fullName: 'Biên tập viên Ban Tin tức', email: 'staff@funews.edu.vn', role: 2, status: 1, createdAt: '2026-09-15' },
  { id: 3, username: 'hoang_nam', fullName: 'Lê Hoàng Nam (Phóng viên)', email: 'nam.lh@funews.edu.vn', role: 2, status: 1, createdAt: '2026-10-01' },
  { id: 4, username: 'thu_trang', fullName: 'Nguyễn Thu Trang (Cộng tác viên)', email: 'trang.nt@funews.edu.vn', role: 2, status: 0, createdAt: '2026-10-05' },
];

export const DEFAULT_NEWS = [
  {
    id: 1,
    title: 'Google DeepMind công bố thế hệ AI mới hỗ trợ phát triển phần mềm',
    content: 'Mô hình tác tử AI thế hệ mới có khả năng giải quyết các tác vụ lập trình phức tạp, tự động viết test suite và tối ưu hiệu năng toàn diện.',
    categoryId: 2,
    createdBy: 'Admin',
    status: 1,
    tags: ['AI', 'Google', 'Technology'],
    createdAt: '2026-10-10',
  },
  {
    id: 2,
    title: 'ASEAN đẩy mạnh chuyển đổi kinh tế số và phát triển bền vững 2026',
    content: 'Các nước thành viên cam kết xây dựng khung pháp lý chung về trao đổi dữ liệu xuyên biên giới và hỗ trợ các startup xanh.',
    categoryId: 3,
    createdBy: 'Staff',
    status: 1,
    tags: ['ASEAN', 'KinhDoanh', 'GreenEconomy'],
    createdAt: '2026-10-09',
  },
  {
    id: 3,
    title: 'Hội nghị thượng đỉnh khí hậu toàn cầu khai mạc với cam kết giảm phát thải',
    content: 'Hơn 120 quốc gia cùng thảo luận các biện pháp cụ thể tài trợ cho năng lượng tái tạo và giải pháp thích ứng biến đổi khí hậu.',
    categoryId: 1,
    createdBy: 'hoang_nam',
    status: 1,
    tags: ['Climate', 'ThếGiới', 'Global'],
    createdAt: '2026-10-08',
  },
  {
    id: 4,
    title: 'Đại học FPT mở rộng ngành đào tạo Kỹ sư Thiết kế Vi mạch & Bán dẫn',
    content: 'Chương trình hợp tác trực tiếp với các tập đoàn công nghệ bán dẫn quốc tế nhằm cung ứng nhân lực chất lượng cao.',
    categoryId: 4,
    createdBy: 'Admin',
    status: 1,
    tags: ['FPT', 'BánDẫn', 'GiáoDục'],
    createdAt: '2026-10-07',
  },
  {
    id: 5,
    title: 'Đột phá công nghệ pin thể rắn: Tăng gấp đôi tầm vận hành xe điện',
    content: 'Vật liệu điện phân mới giúp pin sạc nhanh 80% chỉ trong 10 phút, an toàn chống cháy nổ và có độ bền vượt trội.',
    categoryId: 2,
    createdBy: 'Staff',
    status: 0,
    tags: ['Tech', 'EV', 'Battery'],
    createdAt: '2026-10-05',
  },
];

export const storageService = {
  get(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (err) {
      console.error(`Lỗi đọc localStorage key [${key}]:`, err);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Lỗi ghi localStorage key [${key}]:`, err);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`Lỗi xóa localStorage key [${key}]:`, err);
    }
  },

  // Khởi tạo dữ liệu nếu chưa có trong localStorage
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      this.set(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
      this.set(STORAGE_KEYS.NEWS, DEFAULT_NEWS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.set(STORAGE_KEYS.USERS, DEFAULT_USERS);
    }
  },

  // Khôi phục toàn bộ mock data về mặc định
  resetAll() {
    this.set(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    this.set(STORAGE_KEYS.NEWS, DEFAULT_NEWS);
    this.set(STORAGE_KEYS.USERS, DEFAULT_USERS);
  },

  KEYS: STORAGE_KEYS,
};
