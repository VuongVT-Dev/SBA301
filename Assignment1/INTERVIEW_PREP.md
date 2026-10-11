# CẨM NANG VẤN ĐÁP & BẢO VỆ CODE (INTERVIEW & DEFENSE GUIDE)
> **Học phần**: SBA301 – Integrate Single Page Application with Spring Boot  
> **Dự án**: FUNewsManagementSystem • Assignment 01  
> **Mục tiêu**: Chuẩn bị đầy đủ kiến thức, phản xạ và thao tác code để đạt điểm tối đa (10.0/10.0) theo rubric.

---

## 1. Khung trả lời 5 tầng khi được yêu cầu giải thích bất kỳ Component/Hàm nào

Khi giảng viên chỉ định một file hoặc chức năng, hãy trình bày liền mạch theo 5 tầng:
1. **Tầng 1 - Purpose (Mục đích)**:
   > *"Component này đảm nhiệm việc hiển thị và quản lý vòng đời của [Tên chức năng], tuân thủ phân tách trách nhiệm trong mô hình SPA."*
2. **Tầng 2 - Input (Dữ liệu đầu vào)**:
   > *"Dữ liệu đi vào component thông qua props và custom hook `useApp()`, bao gồm danh sách dữ liệu, hàm xử lý và state của người dùng hiện tại."*
3. **Tầng 3 - Trigger (Kích hoạt sự kiện)**:
   > *"Khi người dùng thực hiện tương tác (ví dụ: gõ phím `onChange`, nhấn nút `onClick`, hoặc submit form `onSubmit`), một event handler được kích hoạt."*
4. **Tầng 4 - Transform (Xử lý biến đổi logic)**:
   > *"Hàm xử lý tiến hành validate dữ liệu, chuẩn hóa chuỗi (`trim`, `toLowerCase`), sau đó gọi phương thức tương ứng ở tầng service và cập nhật React State theo nguyên tắc **bất biến (Immutable Update)**."*
5. **Tầng 5 - Output (Kết quả hiển thị)**:
   > *"React so sánh Virtual DOM và thực hiện re-render lại UI, hiển thị bản ghi mới, đóng hộp thoại modal và kích hoạt thông báo Toast thành công."*

---

## 2. Bảng 6 quyết định thiết kế (Design Decision Record - Mục 3.6 PDF)

| Quyết định thiết kế | Lựa chọn của em | Lý do lựa chọn | Ảnh hưởng nếu thay đổi yêu cầu |
| :--- | :--- | :--- | :--- |
| **1. Navigation** | State Navigation kết hợp Tab Switcher trong Master Layout | Đơn giản, nhẹ nhàng, không phụ thuộc thư viện ngoài phức tạp, tải trang SPA tức thì | Nếu sau này cần Deep link (URL trực tiếp cho từng bài viết), chỉ cần bọc `<BrowserRouter>` và thay `activeTab` bằng `<Route path="/news/:id">` |
| **2. State Ownership** | Local UI State tại component, Shared State trong React Context API | Tránh việc prop drilling quá sâu, tách bạch giữa trạng thái giao diện tạm thời và dữ liệu dùng chung | Khi mở rộng thêm các trang báo cáo phân tích, chỉ cần gọi `useApp()` là có ngay toàn bộ dữ liệu |
| **3. Mock Data Persistence** | LocalStorage API thông qua Service Layer | Giúp bảo toàn dữ liệu và phiên đăng nhập khi người dùng F5/reload trang | Khi kết nối cơ sở dữ liệu thật qua Spring Boot, chỉ cần thay đổi các hàm trong `storageService` thành API calls |
| **4. CRUD Dialog Reuse** | Tái sử dụng một Modal component chung cho cả Create và Update | Tiết kiệm mã nguồn, đồng nhất trải nghiệm người dùng, form tự động reset khi tạo mới và prefill khi sửa | Dễ bảo trì và chỉnh sửa giao diện form tại một nơi duy nhất |
| **5. Search Strategy** | Tính toán danh sách lọc thông qua `useMemo` trên bản sao dữ liệu | Không bao giờ ghi đè hoặc làm mất mảng dữ liệu gốc (source list), tìm kiếm chuẩn hóa không phân biệt hoa/thường | Khi người dùng xóa từ khóa tìm kiếm (Clear), toàn bộ danh sách lập tức xuất hiện trở lại mà không cần tải lại |
| **6. Folder Structure** | Phân tách modular: `components/`, `pages/`, `services/`, `context/` | Đảm bảo tính mở rộng cao, cấu trúc sạch sẽ chuẩn mực doanh nghiệp | Dễ dàng cho người khác đọc hiểu dự án hoặc chuyển đổi sang các framework khác |

---

## 3. Checklist "Mở file và chỉ code trong ≤ 30 giây"

| Yêu cầu của Giảng viên | File cần mở | Dòng / Vị trí cần chỉ vào |
| :--- | :--- | :--- |
| **Mở code xử lý Login & kiểm tra Admin/Admin** | `src/services/authService.js` hoặc `src/pages/LoginPage.jsx` | Chỉ vào hàm `login(username, password)` kiểm tra điều kiện `trimmedUser === 'Admin' && trimmedPass === 'Admin'` |
| **Mở nơi lưu Auth state & Logout** | `src/context/AppContext.jsx` | Chỉ vào `const [currentUser, setCurrentUser] = useState(...)` và hàm `logout()` gọi `authService.logout()` |
| **Mở Category CRUD logic** | `src/services/categoryService.js` | Chỉ vào các phương thức `create`, `update`, `delete` và việc cập nhật mảng bất biến |
| **Mở News liên kết với categoryId** | `src/pages/NewsManagement.jsx` | Chỉ vào hàm `getCategoryName(article.categoryId)` tra cứu từ danh mục `categories` |
| **Mở hiển thị Role 1 và Role 2** | `src/components/common/Badge.jsx` | Chỉ vào `RoleBadge` ánh xạ `role === 1` thành "Quản trị viên (Admin)" và `role === 2` thành "Nhân viên (Staff)" |
| **Mở logic hộp thoại xác nhận xóa** | `src/components/common/ConfirmModal.jsx` | Chỉ vào nút "Hủy bỏ" (`onClose`) và nút "Xác nhận xóa" (`onConfirm`) |
| **Mở logic Search và chứng minh không mất list gốc** | `src/pages/CategoryManagement.jsx` | Chỉ vào `filteredCategories = useMemo(...)` lọc từ mảng `categories` mà không mutate `categories` |
| **Mở Modal form Create / Update** | `src/components/modals/CategoryModal.jsx` | Chỉ vào `useEffect` prefill `formData` nếu `mode === 'update'`, hoặc reset rỗng nếu `mode === 'create'` |
| **Mở nơi khởi tạo và đọc LocalStorage** | `src/services/storageService.js` | Chỉ vào hàm `init()` kiểm tra và nạp `DEFAULT_CATEGORIES`, `DEFAULT_NEWS`, `DEFAULT_USERS` |

---

## 4. Trả lời 6 Mini Interview Cards (Mục 12.7 PDF)

### Card A - Login
- **Hỏi**: *"Controlled input là gì và sau khi đăng nhập thành công state nào thay đổi?"*
- **Trả lời**: Controlled input là ô nhập liệu mà giá trị của nó được quản lý hoàn toàn bởi React State thông qua `value={username}` và `onChange={(e) => setUsername(e.target.value)}`. Sau khi bấm Submit và kiểm tra đúng `Admin/Admin`, `currentUser` trong `AppContext` được cập nhật đối tượng người dùng, khiến `App.jsx` re-render và chuyển từ `LoginPage` sang `AdminLayout`.

### Card B - Create / Update
- **Hỏi**: *"Vì sao không mutate trực tiếp mảng khi cập nhật dữ liệu?"*
- **Trả lời**: React phát hiện sự thay đổi trạng thái (state changes) dựa trên tính đồng nhất của tham chiếu đối tượng (shallow comparison). Nếu ta dùng `list.push()` hoặc thay đổi trực tiếp thuộc tính mà không tạo ra mảng mới (`[...list]`), React sẽ không nhận biết được dữ liệu đã đổi và sẽ không kích hoạt quá trình re-render Virtual DOM.

### Card C - Delete
- **Hỏi**: *"Confirmation dialog hoạt động như thế nào để ngăn người dùng vô ý xóa nhầm?"*
- **Trả lời**: Khi bấm Delete ở một dòng, ta lưu đối tượng vào state `categoryToDelete` và bật cờ `confirmDeleteOpen = true`. Nếu người dùng bấm "Hủy bỏ", ta chỉ đóng popup và giữ nguyên dữ liệu. Chỉ khi người dùng bấm "Xác nhận xóa", hàm `deleteCategory(id)` mới được thực thi và loại bỏ phần tử ra khỏi mảng bằng phương thức `filter()`.

### Card D - Search
- **Hỏi**: *"Làm sao để đảm bảo chức năng Search không xóa mất dữ liệu gốc?"*
- **Trả lời**: Em duy trì mảng dữ liệu gốc `categories` trong State. Trong khi đó, bảng dữ liệu chỉ hiển thị danh sách phái sinh `filteredCategories` được tính toán thông qua hook `useMemo`. Dữ liệu gốc luôn toàn vẹn 100%, do đó khi xóa từ khóa tìm kiếm, bảng lập tức phục hồi đầy đủ toàn bộ bản ghi.

### Card E - Debug
- **Hỏi**: *"Nếu sau khi bấm Sửa mà danh sách hiển thị sai dữ liệu của bản ghi khác, em khoanh vùng lỗi ở đâu?"*
- **Trả lời**: Em sẽ kiểm tra 3 điểm theo quy trình debug:
  1. Kiểm tra ID được truyền vào hàm mở modal: có đang dùng nhầm số thứ tự index thay vì `item.id` duy nhất hay không.
  2. Kiểm tra `selectedItem` khi mở modal xem dữ liệu prefill có đúng ID đó không.
  3. Kiểm tra hàm update tại tầng service xem điều kiện so sánh `item.id === targetId` có bị sai kiểu dữ liệu (`String` so với `Number`) hay không.

### Card F - Transfer Task (Yêu cầu thay đổi nhỏ tại chỗ)
- **Hỏi**: *"Nếu bây giờ thầy yêu cầu thêm một nút Đặt lại (Reset) trong form tạo danh mục, em làm thế nào?"*
- **Trả lời**:
  > *"Em đã đón đầu và hiện thực sẵn nút **'Đặt lại' (RotateCcw icon)** trong tất cả các Modal form (`CategoryModal`, `NewsModal`, `UserModal`). Khi người dùng nhấn nút này, hàm `handleReset()` sẽ khôi phục lại toàn bộ các ô nhập liệu về trạng thái rỗng hoặc giá trị ban đầu của bản ghi!"*
