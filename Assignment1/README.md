# FUNews Management System (FUNMS)
> **Học phần**: SBA301 – Integrate Single Page Application with Spring Boot  
> **Bài tập**: Assignment 01 – Working with ReactJS Application  
> **Chuẩn đầu ra**: CLO1 (React SPA Frontend), CLO2 (Data Integration & State Management)  
> **Thư mục dự án**: `D:\FA26\SBA301\Assignment`

---

## 1. Giới thiệu tổng quan
**FUNews Management System** là ứng dụng Single Page Application (SPA) xây dựng bằng **ReactJS** và **Vite**, phục vụ công tác quản trị biên tập tin bài, phân loại chuyên mục và phân quyền người dùng tại môi trường đào tạo FPT University.

Hệ thống được thiết kế theo chuẩn kiến trúc hướng dịch vụ (**Service Layer Pattern**) kết hợp cùng **React Context API**, tách biệt hoàn toàn giữa tầng hiển thị (UI Components) và tầng xử lý dữ liệu (Services / LocalStorage), giúp mã nguồn tường minh, dễ giải thích trong buổi đánh giá vấn đáp và sẵn sàng kết nối trực tiếp với backend **Spring Boot REST API** trong các giai đoạn tiếp theo.

---

## 2. Thông tin tài khoản kiểm thử (Credentials)

| Tài khoản | Tên đăng nhập (Username) | Mật khẩu (Password) | Vai trò (Role) | Phạm vi quyền hạn |
| :--- | :--- | :--- | :--- | :--- |
| **Quản trị viên** | `Admin` | `Admin` | Role 1 (Admin) | Toàn quyền quản trị Dashboard, Category, News, Users, Settings |
| **Biên tập viên** | `Staff` | `Staff` | Role 2 (Staff) | Quản lý tin bài, danh mục; không xóa tài khoản admin |

> **Mẹo demo**: Trang Đăng nhập có sẵn 2 nút **"Điền nhanh Admin / Admin"** và **"Điền nhanh Staff / Staff"** để giảng viên hoặc sinh viên có thể kiểm thử đăng nhập nhanh chóng chỉ với 1 click.

---

## 3. Hướng dẫn cài đặt & Khởi chạy dự án

### Yêu cầu môi trường
- **Node.js**: Phiên bản 18.x trở lên (đã kiểm thử tương thích hoàn hảo trên Node v20.20.2)
- **NPM**: Phiên bản 9.x / 10.x trở lên

### Các bước thực hiện
1. **Di chuyển vào thư mục dự án**:
   ```bash
   cd D:\FA26\SBA301\Assignment
   ```

2. **Cài đặt các gói phụ thuộc (Dependencies)**:
   ```bash
   npm install
   ```

3. **Khởi chạy máy chủ phát triển (Development Server)**:
   ```bash
   npm run dev
   ```

4. **Truy cập ứng dụng**:
   Mở trình duyệt web và truy cập địa chỉ: [http://localhost:5173/](http://localhost:5173/)

5. **Kiểm tra bản build sản phẩm (Production Build)**:
   ```bash
   npm run build
   ```

---

## 4. Bảng tính năng cốt lõi (Core Requirements Matrix)

| Mã Yêu Cầu | Tên Yêu Cầu | Trạng thái | Vị trí hiện thực |
| :--- | :--- | :---: | :--- |
| **R01** | Project ReactJS + Vite chuẩn cấu trúc | **Đạt** | `package.json`, `vite.config.js` |
| **R02** | Login page (Controlled inputs, validation rỗng & sai) | **Đạt** | `src/pages/LoginPage.jsx` |
| **R03** | Auth state + Điều hướng sau khi đăng nhập | **Đạt** | `src/context/AppContext.jsx`, `src/App.jsx` |
| **R04** | Logo thương hiệu FUNews tạo bằng AI | **Đạt** | `public/logo.jpg`, `src/assets/logo.jpg` |
| **R05** | Master Admin Layout (Header + User Badge + Logout) | **Đạt** | `src/components/layout/Header.jsx`, `AdminLayout.jsx` |
| **R06** | Sidebar Navigation (Dashboard, Category, News, Users, Settings) | **Đạt** | `src/components/layout/Sidebar.jsx` |
| **R07** | CRUD + Search cho Danh mục (Category) | **Đạt** | `src/pages/CategoryManagement.jsx`, `CategoryModal.jsx` |
| **R08** | CRUD + Search cho Tin bài (News Article) | **Đạt** | `src/pages/NewsManagement.jsx`, `NewsModal.jsx` |
| **R09** | CRUD + Search cho Người dùng (Account/User) | **Đạt** | `src/pages/UserManagement.jsx`, `UserModal.jsx` |
| **R10** | Create / Update thao tác bằng Popup Modal Dialog | **Đạt** | `src/components/common/Modal.jsx`, các Modal forms |
| **R11** | Confirmation Modal khi xóa dữ liệu (Cancel không xóa, Confirm mới xóa) | **Đạt** | `src/components/common/ConfirmModal.jsx` |
| **R12** | Mô hình dữ liệu hợp lý (Khóa ngoại categoryId, Role 1/2, Status 0/1) | **Đạt** | `src/services/storageService.js` |

---

## 5. Cấu trúc thư mục dự án

```text
D:\FA26\SBA301\Assignment\
├── public\
│   └── logo.jpg                     # Logo thương hiệu tạo bằng AI
├── src\
│   ├── assets\
│   │   └── logo.jpg                 # Asset logo phục vụ import trong code
│   ├── components\
│   │   ├── common\                  # Các UI component dùng chung
│   │   │   ├── Badge.jsx            # StatusBadge (0/1), RoleBadge (Admin/Staff)
│   │   │   ├── ConfirmModal.jsx     # Hộp thoại xác nhận xóa dữ liệu (R11)
│   │   │   ├── Modal.jsx            # Popup Modal wrapper với phím Escape / Backdrop click (R10)
│   │   │   └── SearchBar.jsx        # Thanh tìm kiếm có chuẩn hóa từ khóa và nút Clear
│   │   ├── layout\                  # Khung bố cục Master Admin
│   │   │   ├── AdminLayout.jsx      # Master layout bọc Header, Sidebar và Toast
│   │   │   ├── Header.jsx           # Logo AI, tên hệ thống, thông tin user, nút Reset data, nút Logout
│   │   │   └── Sidebar.jsx          # Menu điều hướng 5 khu vực kèm badge số lượng
│   │   └── modals\                  # Các form nhập liệu popup
│   │       ├── CategoryModal.jsx    # Form thêm/sửa danh mục kèm validation & nút Reset
│   │       ├── NewsModal.jsx        # Form viết/sửa tin bài kèm dropdown categoryId & tags
│   │       └── UserModal.jsx        # Form thêm/sửa tài khoản kèm kiểm tra email regex & unique username
│   ├── context\
│   │   └── AppContext.jsx           # Global state quản lý Auth, Navigation, Data & Toasts
│   ├── pages\                       # Các trang màn hình chính
│   │   ├── LoginPage.jsx            # Màn hình đăng nhập (Admin/Admin, Staff/Staff)
│   │   ├── DashboardPage.jsx        # Thống kê tổng quan KPI, bài viết mới nhất, phân bổ danh mục
│   │   ├── CategoryManagement.jsx   # Quản trị danh mục (CRUD + Tìm kiếm + Lọc trạng thái)
│   │   ├── NewsManagement.jsx       # Quản trị tin bài (CRUD + Tìm kiếm + Lọc chuyên mục)
│   │   ├── UserManagement.jsx       # Quản trị tài khoản (CRUD + Phân quyền Role)
│   │   └── SettingsPage.jsx         # Cài đặt, thông tin phiên, xuất bản sao lưu JSON, reset dữ liệu
│   ├── services\                    # Tầng dịch vụ dữ liệu độc lập
│   │   ├── authService.js           # Xử lý kiểm tra tài khoản, lưu và xóa phiên
│   │   ├── categoryService.js       # CRUD danh mục, sinh id tự tăng, kiểm tra trùng lặp
│   │   ├── newsService.js           # CRUD bài viết, liên kết categoryId, xử lý mảng tags
│   │   ├── storageService.js        # Đọc/ghi LocalStorage, nạp seed data mặc định
│   │   └── userService.js           # CRUD người dùng, kiểm tra định dạng email và trùng lặp
│   ├── index.css                    # Toàn bộ CSS Design System (Bảng màu Indigo/Slate, Glassmorphism)
│   ├── App.jsx                      # Root Component: Auth Guard & Tab Switcher
│   └── main.jsx                     # Điểm khởi tạo ứng dụng React 19
├── index.html                       # HTML gốc cấu hình Favicon và Google Fonts (Inter & Outfit)
├── package.json                     # Thông tin gói phụ thuộc và scripts
├── README.md                        # Tài liệu hướng dẫn dự án (File này)
├── TEST_MATRIX.md                   # Bảng kiểm thử chi tiết 35 test cases chuẩn rubric
└── INTERVIEW_PREP.md                # Cẩm nang trả lời phỏng vấn và giải thích code 5 tầng
```

---

## 6. Thiết kế giải pháp kỹ thuật & Trả lời vấn đáp (Key Architectural Decisions)

1. **State Ownership**:
   - **Local UI State**: Trạng thái mở/đóng modal (`modalOpen`), từ khóa tìm kiếm (`searchTerm`), chế độ modal (`modalMode`) đặt trực tiếp tại từng page/component vì chỉ có tính chất hiển thị cục bộ.
   - **Shared State**: Dữ liệu `categories`, `news`, `users` và phiên đăng nhập `currentUser` được đặt trong `AppContext` để chia sẻ xuyên suốt các trang (ví dụ: Dashboard cần số liệu để đếm; News cần danh sách Category để hiển thị tên và làm dropdown).
   - **Persistent State**: Sử dụng `localStorage` qua `storageService` để lưu trữ trạng thái người dùng và dữ liệu CRUD, đảm bảo không bị mất dữ liệu khi F5/reload trang.

2. **Tìm kiếm không phá hủy dữ liệu gốc (Non-destructive Search)**:
   - Trong `CategoryManagement`, `NewsManagement`, `UserManagement`: Danh sách hiển thị (`filteredCategories`, `filteredNews`, `filteredUsers`) được tính toán thông qua hook `useMemo` dựa trên `searchTerm` và `categories`/`news`/`users`. Mảng gốc `categories`, `news` tuyệt đối không bị thay đổi hoặc ghi đè khi tìm kiếm.
   - Khi xóa từ khóa tìm kiếm (Clear search), giao diện lập tức hiển thị lại đầy đủ toàn bộ danh sách.

3. **Tính bất biến khi cập nhật State (Immutable Updates)**:
   - Khi thêm mới: Sử dụng cú pháp Spread `[newItem, ...prevList]`.
   - Khi cập nhật: Tạo mảng mới hoặc `list.map(item => item.id === id ? updatedItem : item)`.
   - Khi xóa: Sử dụng `list.filter(item => item.id !== id)`.
   - Tuyệt đối không dùng `push`, `splice`, hoặc gán trực tiếp thuộc tính của object.

4. **Sẵn sàng tích hợp Spring Boot API**:
   - Nhờ phân tách tầng `services/`, khi kết nối backend Spring Boot trong Assignment tiếp theo, sinh viên chỉ cần thay đổi các hàm trong `categoryService.js`, `newsService.js`, `userService.js` từ `storageService` sang các lệnh gọi `fetch()` hoặc `axios.get('/api/v1/news')`. Toàn bộ giao diện UI Components giữ nguyên mà không cần viết lại.

---

## 7. Giới hạn hệ thống (Limitations)
- Xác thực hiện tại sử dụng cơ chế Mock Authentication lưu trong LocalStorage (theo phạm vi đề bài Assignment 01), chưa kết nối JWT token thật từ backend Spring Boot.
- Thao tác xóa danh mục hiện áp dụng chính sách cảnh báo số lượng bài viết liên quan (Soft warning policy) thay vì ràng buộc khóa ngoại tầng cơ sở dữ liệu thật.

---

## 8. Nhật ký sử dụng AI có kiểm soát (AI Usage Log)
- **Công cụ hỗ trợ**: Google DeepMind Agentic Assistant
- **Phần áp dụng**:
  1. Sinh ảnh logo thương hiệu vector `FUNews Management System` (Lưu tại `public/logo.jpg`).
  2. Xây dựng cấu trúc thư mục chuẩn mực theo tài liệu hướng dẫn `SBA301_Assignment_01.pdf`.
  3. Lập bảng Ma trận kiểm thử 35 test cases (`TEST_MATRIX.md`) và tài liệu hướng dẫn phỏng vấn (`INTERVIEW_PREP.md`).
- **Cách kiểm chứng**: Chạy kiểm thử tự động toàn diện qua Browser Subagent, kiểm tra build production bằng `npm run build` và xác nhận không có bất kỳ lỗi nào.
