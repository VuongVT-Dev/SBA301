# Assignment 02 SBA301 - FUNewsManagementSystem (`A2VuongVT_CE191082`)

Hệ thống quản lý bản tin Đại học FPT (**FUNewsManagementSystem**) sử dụng **Spring Boot 3 (3-Layer Architecture + Spring Data JPA + MS SQL Server)** và **ReactJS (Vite + Axios)**.

---

## 1. Cấu trúc thư mục

```text
a2vuongvt_ce191082/
├── A2VuongVT_CE191082_BE/        # Project Spring Boot 3 RESTful API (Backend)
│   ├── pom.xml
│   └── src/main/
│       ├── java/fu/se/a2vuongvt_ce191082/
│       │   ├── A2VuongvtCe191082Application.java
│       │   ├── config/           # CorsConfig, GlobalExceptionHandler, DataInitializer
│       │   ├── entity/           # SystemAccount, Category, Tag, NewsArticle (NewsTag @ManyToMany)
│       │   ├── repository/       # Spring Data JPA Repositories
│       │   ├── service/          # 3-Layer Business Logic & Ràng buộc xóa
│       │   └── controller/       # RESTful API Endpoints (/api/...)
│       └── resources/
│           └── application.properties
├── src/                          # Project ReactJS Client (Frontend)
│   ├── services/api.js           # Axios client gọi REST API
│   ├── components/
│   │   ├── PublicNewsView.jsx    # Xem tin tức Active công khai (không cần đăng nhập)
│   │   ├── Login.jsx             # Đăng nhập bằng Email & Password
│   │   ├── CrudModal.jsx         # Popup Dialog dùng chung cho Create / Update + Validation
│   │   ├── AccountManagement.jsx # [Admin] CRUD + Search tài khoản (chặn xóa nếu đã tạo bài viết)
│   │   ├── CategoryManagement.jsx# [Staff] CRUD + Search danh mục (chặn xóa nếu đã có bài viết)
│   │   ├── NewsManagement.jsx    # [Staff] CRUD + Search bài viết & gắn thẻ (Tags)
│   │   ├── ProfileManagement.jsx # [Staff] Quản lý hồ sơ cá nhân
│   │   └── NewsHistory.jsx       # [Staff] Xem lịch sử bài viết đã tạo
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 2. Tài khoản có sẵn trong Database `FUNewsManagementSBA301`

| Vai trò | Họ Tên | Email | Mật khẩu | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **Admin (`Role = 1`)** | Steve Paris | `SteveParis@FUNewsManagement.org` | `@1` | Quản lý tài khoản (`SystemAccount`) |
| **Staff (`Role = 2`)** | Emma William | `EmmaWilliam@FUNewsManagement.org` | `@1` | Đã có bài viết 1, 2 (Chặn xóa) |
| **Staff (`Role = 2`)** | Olivia James | `OliviaJames@FUNewsManagement.org` | `@1` | Đã có bài viết 3, 4, 5 (Chặn xóa) |
| **Staff (`Role = 2`)** | Isabella David | `IsabellaDavid@FUNewsManagement.org` | `@1` | Chưa có bài viết (Có thể xóa) |
| **Staff (`Role = 2`)** | Michael Charlotte | `MichaelCharlotte@FUNewsManagement.org` | `@1` | Chưa có bài viết (Có thể xóa) |

---

## 3. Hướng dẫn chạy dự án

### Bước 1: Chạy Backend (Spring Boot - Cổng `8080`)
- Kết nối trực tiếp vào database MS SQL Server `FUNewsManagementSBA301` (`sa` / `123456`).
- Mở thư mục `A2VuongVT_CE191082_BE` trong IntelliJ IDEA và chạy class `A2VuongvtCe191082Application`, hoặc chạy bằng Maven:
```bash
cd A2VuongVT_CE191082_BE
mvn spring-boot:run
```

### Bước 2: Chạy Frontend (ReactJS - Cổng `5173`)
Tại thư mục gốc `a2vuongvt_ce191082`:
```bash
npm install
npm run dev
```
Truy cập trình duyệt tại: `http://localhost:5173`
