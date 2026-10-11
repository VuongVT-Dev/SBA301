// FUNewsManagementSystem - User Service
// Quản lý CRUD tài khoản người dùng (Role: 1 = Admin, 2 = Staff)

import { storageService, DEFAULT_USERS } from './storageService';

export const userService = {
  getAll() {
    return storageService.get(storageService.KEYS.USERS, DEFAULT_USERS);
  },

  getById(id) {
    const list = this.getAll();
    return list.find((u) => u.id === Number(id)) || null;
  },

  create(userData) {
    const list = this.getAll();
    const username = (userData.username || '').trim();
    const fullName = (userData.fullName || '').trim();
    const email = (userData.email || '').trim();

    if (!username) {
      throw new Error('Tên tài khoản (username) không được để trống!');
    }
    if (!fullName) {
      throw new Error('Họ và tên không được để trống!');
    }
    if (!email) {
      throw new Error('Email không được để trống!');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Định dạng email không hợp lệ (ví dụ: user@funews.edu.vn)!');
    }

    // Kiểm tra username trùng lặp
    const exists = list.some((u) => u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      throw new Error(`Tên tài khoản "${username}" đã được sử dụng!`);
    }

    const maxId = list.reduce((max, u) => Math.max(max, u.id || 0), 0);
    const newUser = {
      id: maxId + 1,
      username,
      fullName,
      email,
      role: Number(userData.role) === 1 ? 1 : 2, // 1: Admin, 2: Staff
      status: Number(userData.status) === 0 ? 0 : 1, // 1: Active, 0: Inactive
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedList = [newUser, ...list];
    storageService.set(storageService.KEYS.USERS, updatedList);
    return newUser;
  },

  update(id, userData) {
    const list = this.getAll();
    const targetId = Number(id);
    const username = (userData.username || '').trim();
    const fullName = (userData.fullName || '').trim();
    const email = (userData.email || '').trim();

    if (!username) {
      throw new Error('Tên tài khoản không được để trống!');
    }
    if (!fullName) {
      throw new Error('Họ và tên không được để trống!');
    }
    if (!email) {
      throw new Error('Email không được để trống!');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Định dạng email không hợp lệ!');
    }

    // Kiểm tra trùng tên với user khác
    const exists = list.some((u) => u.id !== targetId && u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
      throw new Error(`Tên tài khoản "${username}" đã được sử dụng bởi người dùng khác!`);
    }

    const index = list.findIndex((u) => u.id === targetId);
    if (index === -1) {
      throw new Error(`Không tìm thấy người dùng với ID: ${id}`);
    }

    const updatedItem = {
      ...list[index],
      username,
      fullName,
      email,
      role: Number(userData.role) === 1 ? 1 : 2,
      status: Number(userData.status) === 0 ? 0 : 1,
    };

    const updatedList = [...list];
    updatedList[index] = updatedItem;

    storageService.set(storageService.KEYS.USERS, updatedList);
    return updatedItem;
  },

  delete(id, currentUserId) {
    const list = this.getAll();
    const targetId = Number(id);

    if (currentUserId && targetId === Number(currentUserId)) {
      throw new Error('Bạn không thể tự xóa tài khoản đang đăng nhập phiên hiện tại!');
    }

    const filtered = list.filter((u) => u.id !== targetId);
    storageService.set(storageService.KEYS.USERS, filtered);
    return { success: true };
  },
};
