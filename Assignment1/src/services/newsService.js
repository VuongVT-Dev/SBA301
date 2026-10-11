// FUNewsManagementSystem - News Service
// Quản lý CRUD nghiệp vụ bài viết tin tức và liên kết Category

import { storageService, DEFAULT_NEWS } from './storageService';
import { categoryService } from './categoryService';

export const newsService = {
  getAll() {
    return storageService.get(storageService.KEYS.NEWS, DEFAULT_NEWS);
  },

  getById(id) {
    const list = this.getAll();
    return list.find((n) => n.id === Number(id)) || null;
  },

  create(newsData) {
    const list = this.getAll();
    const title = (newsData.title || '').trim();
    const content = (newsData.content || '').trim();
    const categoryId = Number(newsData.categoryId);

    if (!title) {
      throw new Error('Tiêu đề bài viết không được để trống!');
    }
    if (!content) {
      throw new Error('Nội dung bài viết không được để trống!');
    }
    if (!categoryId) {
      throw new Error('Vui lòng chọn danh mục cho bài viết!');
    }

    // Kiểm tra categoryId có tồn tại trong hệ thống không
    const categoryExists = categoryService.getById(categoryId);
    if (!categoryExists) {
      throw new Error('Danh mục được chọn không tồn tại!');
    }

    // Xử lý tags từ chuỗi hoặc mảng
    let tags = [];
    if (Array.isArray(newsData.tags)) {
      tags = newsData.tags;
    } else if (typeof newsData.tags === 'string') {
      tags = newsData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const maxId = list.reduce((max, n) => Math.max(max, n.id || 0), 0);
    const newArticle = {
      id: maxId + 1,
      title,
      content,
      categoryId,
      createdBy: (newsData.createdBy || 'Admin').trim(),
      status: Number(newsData.status) === 0 ? 0 : 1, // 1: Active, 0: Inactive
      tags,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedList = [newArticle, ...list];
    storageService.set(storageService.KEYS.NEWS, updatedList);
    return newArticle;
  },

  update(id, newsData) {
    const list = this.getAll();
    const targetId = Number(id);
    const title = (newsData.title || '').trim();
    const content = (newsData.content || '').trim();
    const categoryId = Number(newsData.categoryId);

    if (!title) {
      throw new Error('Tiêu đề bài viết không được để trống!');
    }
    if (!content) {
      throw new Error('Nội dung bài viết không được để trống!');
    }
    if (!categoryId) {
      throw new Error('Vui lòng chọn danh mục cho bài viết!');
    }

    const categoryExists = categoryService.getById(categoryId);
    if (!categoryExists) {
      throw new Error('Danh mục được chọn không tồn tại!');
    }

    const index = list.findIndex((n) => n.id === targetId);
    if (index === -1) {
      throw new Error(`Không tìm thấy bài viết với ID: ${id}`);
    }

    let tags = [];
    if (Array.isArray(newsData.tags)) {
      tags = newsData.tags;
    } else if (typeof newsData.tags === 'string') {
      tags = newsData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const updatedItem = {
      ...list[index],
      title,
      content,
      categoryId,
      status: Number(newsData.status) === 0 ? 0 : 1,
      tags,
    };

    const updatedList = [...list];
    updatedList[index] = updatedItem;

    storageService.set(storageService.KEYS.NEWS, updatedList);
    return updatedItem;
  },

  delete(id) {
    const list = this.getAll();
    const targetId = Number(id);
    const filtered = list.filter((n) => n.id !== targetId);
    storageService.set(storageService.KEYS.NEWS, filtered);
    return { success: true };
  },
};
