// FUNewsManagementSystem - Auth Service
// Quản lý đăng nhập, phiên người dùng (Admin = 1, Staff = 2)

import { storageService } from './storageService';

export const authService = {
  // Xác thực đăng nhập
  login(username, password) {
    const trimmedUser = (username || '').trim();
    const trimmedPass = (password || '').trim();

    if (!trimmedUser || !trimmedPass) {
      return { success: false, message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!' };
    }

    // Tài khoản chuẩn theo yêu cầu đề bài: Admin / Admin
    if (trimmedUser === 'Admin' && trimmedPass === 'Admin') {
      const user = {
        id: 1,
        username: 'Admin',
        fullName: 'Hệ thống Quản trị viên',
        role: 1, // 1 = Admin
        email: 'admin@funews.edu.vn',
      };
      storageService.set(storageService.KEYS.SESSION, user);
      return { success: true, user };
    }

    // Tài khoản Staff hỗ trợ kiểm thử phân quyền: Staff / Staff
    if (trimmedUser === 'Staff' && trimmedPass === 'Staff') {
      const user = {
        id: 2,
        username: 'Staff',
        fullName: 'Biên tập viên Ban Tin tức',
        role: 2, // 2 = Staff
        email: 'staff@funews.edu.vn',
      };
      storageService.set(storageService.KEYS.SESSION, user);
      return { success: true, user };
    }

    return {
      success: false,
      message: 'Sai thông tin đăng nhập! Thử "Admin" / "Admin" hoặc "Staff" / "Staff".',
    };
  },

  // Đăng xuất và xóa phiên
  logout() {
    storageService.remove(storageService.KEYS.SESSION);
  },

  // Lấy người dùng hiện tại từ session storage
  getCurrentUser() {
    return storageService.get(storageService.KEYS.SESSION, null);
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },
};
