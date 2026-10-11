// FUNewsManagementSystem - Category Service
// Quản lý CRUD nghiệp vụ danh mục bài viết

import { storageService, DEFAULT_CATEGORIES } from './storageService';

export const categoryService = {
  getAll() {
    return storageService.get(storageService.KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  },

  getById(id) {
    const list = this.getAll();
    return list.find((c) => c.id === Number(id)) || null;
  },

  create(categoryData) {
    const list = this.getAll();
    const name = (categoryData.name || '').trim();

    if (!name) {
      throw new Error('Tên danh mục không được để trống!');
    }

    // Kiểm tra tên trùng lặp (không phân biệt hoa thường)
    const exists = list.some((c) => c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      throw new Error(`Danh mục "${name}" đã tồn tại!`);
    }

    const maxId = list.reduce((max, c) => Math.max(max, c.id || 0), 0);
    const newCategory = {
      id: maxId + 1,
      name,
      description: (categoryData.description || '').trim(),
      status: Number(categoryData.status) === 0 ? 0 : 1, // 1: Active, 0: Inactive
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedList = [newCategory, ...list];
    storageService.set(storageService.KEYS.CATEGORIES, updatedList);
    return newCategory;
  },

  update(id, categoryData) {
    const list = this.getAll();
    const targetId = Number(id);
    const name = (categoryData.name || '').trim();

    if (!name) {
      throw new Error('Tên danh mục không được để trống!');
    }

    const exists = list.some((c) => c.id !== targetId && c.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      throw new Error(`Danh mục "${name}" đã tồn tại!`);
    }

    const index = list.findIndex((c) => c.id === targetId);
    if (index === -1) {
      throw new Error(`Không tìm thấy danh mục với ID: ${id}`);
    }

    const updatedItem = {
      ...list[index],
      name,
      description: (categoryData.description || '').trim(),
      status: Number(categoryData.status) === 0 ? 0 : 1,
    };

    const updatedList = [...list];
    updatedList[index] = updatedItem;

    storageService.set(storageService.KEYS.CATEGORIES, updatedList);
    return updatedItem;
  },

  delete(id) {
    const list = this.getAll();
    const targetId = Number(id);

    // Kiểm tra liên kết với tin tức
    const newsList = storageService.get(storageService.KEYS.NEWS, []);
    const linkedNewsCount = newsList.filter((n) => Number(n.categoryId) === targetId).length;

    const filtered = list.filter((c) => c.id !== targetId);
    storageService.set(storageService.KEYS.CATEGORIES, filtered);

    return { success: true, linkedNewsCount };
  },
};
