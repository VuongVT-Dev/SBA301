// FUNewsManagementSystem - App Context
// Quản lý global state cho Auth, Navigation, CRUD và Notification

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { categoryService } from '../services/categoryService';
import { newsService } from '../services/newsService';
import { userService } from '../services/userService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Auth state (lưu và hydrate từ session storage)
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  // 2. Navigation state (mặc định vào dashboard)
  const [activeTab, setActiveTab] = useState('dashboard');

  // 3. Data state cho 3 entity chính
  const [categories, setCategories] = useState([]);
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);

  // 4. Notification state (toast thông báo feedback)
  const [toast, setToast] = useState(null);

  // Hiển thị thông báo tạm thời
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 3500 ? null : prev));
    }, 4000);
  }, []);

  // Khởi tạo storage và tải dữ liệu vào React state
  const reloadAllData = useCallback(() => {
    storageService.init();
    setCategories(categoryService.getAll());
    setNews(newsService.getAll());
    setUsers(userService.getAll());
  }, []);

  useEffect(() => {
    reloadAllData();
  }, [reloadAllData]);

  // Auth actions
  const login = (username, password) => {
    const result = authService.login(username, password);
    if (result.success) {
      setCurrentUser(result.user);
      setActiveTab('dashboard');
      showToast(`Đăng nhập thành công! Chào mừng ${result.user.fullName}`, 'success');
      return { success: true };
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    showToast('Đã đăng xuất khỏi hệ thống!', 'info');
  };

  // Khôi phục dữ liệu gốc
  const resetToDefaultData = () => {
    storageService.resetAll();
    reloadAllData();
    showToast('Đã khôi phục toàn bộ dữ liệu mẫu ban đầu!', 'info');
  };

  // Category Actions (bảo đảm immutable update)
  const addCategory = (data) => {
    const created = categoryService.create(data);
    setCategories(categoryService.getAll());
    showToast(`Đã thêm mới danh mục: "${created.name}"`, 'success');
    return created;
  };

  const updateCategory = (id, data) => {
    const updated = categoryService.update(id, data);
    setCategories(categoryService.getAll());
    showToast(`Đã cập nhật danh mục: "${updated.name}"`, 'success');
    return updated;
  };

  const deleteCategory = (id) => {
    const category = categories.find((c) => c.id === id);
    const result = categoryService.delete(id);
    setCategories(categoryService.getAll());
    if (result.linkedNewsCount > 0) {
      showToast(`Đã xóa danh mục "${category?.name || id}" (có ${result.linkedNewsCount} tin bài liên quan)!`, 'warning');
    } else {
      showToast(`Đã xóa danh mục "${category?.name || id}"!`, 'success');
    }
    return result;
  };

  // News Actions (immutable update)
  const addNews = (data) => {
    const created = newsService.create(data);
    setNews(newsService.getAll());
    showToast(`Đã xuất bản tin bài: "${created.title.substring(0, 30)}..."`, 'success');
    return created;
  };

  const updateNews = (id, data) => {
    const updated = newsService.update(id, data);
    setNews(newsService.getAll());
    showToast(`Đã cập nhật bài viết: "${updated.title.substring(0, 30)}..."`, 'success');
    return updated;
  };

  const deleteNews = (id) => {
    const article = news.find((n) => n.id === id);
    newsService.delete(id);
    setNews(newsService.getAll());
    showToast(`Đã xóa bài viết "${article?.title.substring(0, 25) || id}..."!`, 'success');
  };

  // User Actions (immutable update)
  const addUser = (data) => {
    const created = userService.create(data);
    setUsers(userService.getAll());
    showToast(`Đã tạo tài khoản: "${created.username}"`, 'success');
    return created;
  };

  const updateUser = (id, data) => {
    const updated = userService.update(id, data);
    setUsers(userService.getAll());
    showToast(`Đã cập nhật người dùng: "${updated.username}"`, 'success');
    return updated;
  };

  const deleteUser = (id) => {
    const user = users.find((u) => u.id === id);
    userService.delete(id, currentUser?.id);
    setUsers(userService.getAll());
    showToast(`Đã xóa tài khoản "${user?.username || id}"!`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        activeTab,
        setActiveTab,
        categories,
        news,
        users,
        addCategory,
        updateCategory,
        deleteCategory,
        addNews,
        updateNews,
        deleteNews,
        addUser,
        updateUser,
        deleteUser,
        resetToDefaultData,
        toast,
        showToast,
        setToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp phải được sử dụng bên trong AppProvider');
  }
  return context;
};
