# Assignment 03 SBA301 - FUMiniHotelSystem (`A3VuongVT_CE191082`)

Hệ thống quản lý khách sạn (**FUMiniHotelSystem**) sử dụng **Spring Boot 3 (3-Layer Architecture + Spring Data JPA + Spring Security + JWT + MS SQL Server)** và **ReactJS (Vite + Axios)**.

---

## 1. Cấu trúc thư mục (`BE` & `FE`)

```text
a3vuongvt_ce191082/
├── FUMiniHotelManagement.sql     # Script khởi tạo Database & Dữ liệu mẫu (Seed Data)
├── BE/                           # Project Spring Boot RESTful API + JWT Security (Backend)
│   ├── pom.xml
│   └── src/main/
│       ├── java/fu/se/a3vuongvt_ce191082/
│       │   ├── A3VuongvtCe191082Application.java
│       │   ├── config/           # SecurityConfig, JwtService, JwtAuthenticationFilter, CorsConfig, GlobalExceptionHandler
│       │   ├── entity/           # RoomType, RoomInformation, Customer, BookingReservation, BookingDetail (Composite PK)
│       │   ├── repository/       # Spring Data JPA Repositories
│       │   ├── service/          # 3-Layer Business Logic (Ràng buộc xóa phòng / đổi trạng thái)
│       │   └── controller/       # RESTful API Endpoints (/api/...)
│       └── resources/
│           └── application.properties
├── FE/                           # Project ReactJS Client (Frontend)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── services/
│       │   └── api.js            # Axios client tự động đính kèm JWT Bearer Token
│       ├── components/
│       │   ├── PublicRoomView.jsx        # Xem thông tin phòng công khai (Không cần đăng nhập)
│       │   ├── Login.jsx                 # Đăng nhập JWT (Staff / Customer) & Đăng ký tài khoản Customer
│       │   ├── CrudModal.jsx             # Popup Dialog dùng chung cho Create / Update + Validation
│       │   ├── CustomerManagement.jsx    # [Staff] CRUD + Search khách hàng
│       │   ├── RoomManagement.jsx        # [Staff] CRUD + Search phòng (Xóa hoặc đổi Status nếu đã có BookingDetail)
│       │   ├── BookingManagement.jsx     # [Staff] CRUD + Search đơn đặt phòng & chi tiết phòng (BookingDetail)
│       │   ├── CustomerBookingCreate.jsx # [Customer] Đặt 1 hoặc nhiều phòng trực tuyến
│       │   ├── BookingHistory.jsx        # [Customer] Xem lịch sử đặt phòng của bản thân
│       │   └── ProfileManagement.jsx     # [Customer] Quản lý hồ sơ cá nhân
│       ├── App.css
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

---

## 2. Tài khoản đăng nhập

### Tài khoản Staff (Đọc từ `application.properties`)
| Vai trò | Email | Mật khẩu | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Staff** | `admin@FUMiniHotelSystem.com` (hoặc `SteveParis@FUNewsManagement.org`) | `@1` | Cấu hình trong `application.properties` |

### Tài khoản Customer có sẵn trong Database `FUMiniHotelManagement`
| Vai trò | Họ Tên | Email | Mật khẩu | Ghi chú |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | Emma William | `EmmaWilliam@FUNewsManagement.org` | `@1` | Đã có đơn đặt phòng #1 |
| **Customer** | Olivia James | `OliviaJames@FUNewsManagement.org` | `@1` | Đã có đơn đặt phòng #2 |
| **Customer** | Isabella David | `IsabellaDavid@FUNewsManagement.org` | `@1` | Chưa có đơn đặt phòng (Có thể xóa) |
| **Customer** | Michael Charlotte | `MichaelCharlotte@FUNewsManagement.org` | `@1` | Chưa có đơn đặt phòng (Có thể xóa) |
| **Customer** | William Shakespeare | `WilliamShakespeare@FUMiniHotel.org` | `@1` | Chưa có đơn đặt phòng (Có thể xóa) |

---

## 3. Hướng dẫn chạy dự án

### Bước 1: Chạy Backend (`BE` - Cổng `8080`)
- Kết nối trực tiếp vào database MS SQL Server `FUMiniHotelManagement` (`sa` / `123456`).
- Chạy class `A3VuongvtCe191082Application` trong IntelliJ IDEA hoặc dùng lệnh:
```bash
cd BE
mvn spring-boot:run
```

### Bước 2: Chạy Frontend (`FE` - Cổng `5173`)
- Mở terminal tại thư mục `FE`:
```bash
cd FE
npm install
npm run dev
```
Truy cập trình duyệt tại: `http://localhost:5173`
