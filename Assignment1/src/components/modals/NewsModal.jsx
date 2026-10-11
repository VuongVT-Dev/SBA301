// FUNewsManagementSystem - News Modal Dialog
// Tạo mới hoặc Cập nhật tin tức với dropdown danh mục và validation

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { RotateCcw, Check } from 'lucide-react';

export const NewsModal = ({
  isOpen,
  onClose,
  onSubmit,
  news = null,
  categories = [],
  mode = 'create',
  currentUsername = 'Admin',
}) => {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    content: '',
    createdBy: currentUsername,
    tags: '',
    status: 1,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (news && mode === 'update') {
      setFormData({
        title: news.title || '',
        categoryId: news.categoryId || '',
        content: news.content || '',
        createdBy: news.createdBy || currentUsername,
        tags: Array.isArray(news.tags) ? news.tags.join(', ') : '',
        status: news.status !== undefined ? Number(news.status) : 1,
      });
    } else {
      // Create mode
      const defaultCatId = categories.length > 0 ? categories[0].id : '';
      setFormData({
        title: '',
        categoryId: defaultCatId,
        content: '',
        createdBy: currentUsername,
        tags: '',
        status: 1,
      });
    }
    setErrors({});
  }, [news, mode, isOpen, categories, currentUsername]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'categoryId' || name === 'status' ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleReset = () => {
    if (mode === 'update' && news) {
      setFormData({
        title: news.title || '',
        categoryId: news.categoryId || '',
        content: news.content || '',
        createdBy: news.createdBy || currentUsername,
        tags: Array.isArray(news.tags) ? news.tags.join(', ') : '',
        status: news.status !== undefined ? Number(news.status) : 1,
      });
    } else {
      const defaultCatId = categories.length > 0 ? categories[0].id : '';
      setFormData({
        title: '',
        categoryId: defaultCatId,
        content: '',
        createdBy: currentUsername,
        tags: '',
        status: 1,
      });
    }
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề bài viết không được để trống!';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Tiêu đề phải có độ dài ít nhất 5 ký tự!';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Vui lòng chọn danh mục cho bài viết!';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung bài viết không được để trống!';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = 'Nội dung bài viết phải chi tiết hơn (ít nhất 10 ký tự)!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      onSubmit(formData);
      onClose();
    } catch (err) {
      setErrors({ form: err.message });
    }
  };

  const title = mode === 'create' ? 'Thêm mới bài viết tin tức' : 'Chỉnh sửa bài viết';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="720px">
      <form onSubmit={handleSubmit} className="crud-form">
        {errors.form && <div className="form-error-alert">{errors.form}</div>}

        <div className="form-group">
          <label htmlFor="news-title" className="form-label required">
            Tiêu đề bài viết
          </label>
          <input
            id="news-title"
            name="title"
            type="text"
            className={`form-input ${errors.title ? 'input-error' : ''}`}
            placeholder="Nhập tiêu đề tin bài thời sự, công nghệ..."
            value={formData.title}
            onChange={handleChange}
            autoFocus
          />
          {errors.title && <span className="field-error-text">{errors.title}</span>}
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="news-cat" className="form-label required">
              Danh mục tin tức
            </label>
            <select
              id="news-cat"
              name="categoryId"
              className={`form-select ${errors.categoryId ? 'input-error' : ''}`}
              value={formData.categoryId}
              onChange={handleChange}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {Number(c.status) === 0 ? '(Tạm dừng)' : ''}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="field-error-text">{errors.categoryId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="news-status" className="form-label">
              Trạng thái xuất bản
            </label>
            <select
              id="news-status"
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value={1}>1 - Xuất bản (Active)</option>
              <option value={0}>0 - Bản nháp / Ẩn (Inactive)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="news-content" className="form-label required">
            Nội dung bài viết
          </label>
          <textarea
            id="news-content"
            name="content"
            rows={5}
            className={`form-textarea ${errors.content ? 'input-error' : ''}`}
            placeholder="Nội dung chi tiết của bản tin, báo cáo hoặc bài phỏng vấn..."
            value={formData.content}
            onChange={handleChange}
          />
          {errors.content && <span className="field-error-text">{errors.content}</span>}
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="news-tags" className="form-label">
              Thẻ từ khóa (Tags)
            </label>
            <input
              id="news-tags"
              name="tags"
              type="text"
              className="form-input"
              placeholder="Cách nhau bởi dấu phẩy: AI, Tech, DeepMind"
              value={formData.tags}
              onChange={handleChange}
            />
            <span className="field-help-text">Nhập các tag cách nhau bằng dấu phẩy.</span>
          </div>

          <div className="form-group">
            <label htmlFor="news-creator" className="form-label">
              Tác giả / Người đăng
            </label>
            <input
              id="news-creator"
              name="createdBy"
              type="text"
              className="form-input"
              value={formData.createdBy}
              onChange={handleChange}
              placeholder="Tên tác giả hoặc phóng viên"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={handleReset}>
            <RotateCcw size={16} /> Đặt lại
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Hủy bỏ
          </button>
          <button type="submit" className="btn btn-primary">
            <Check size={16} />
            {mode === 'create' ? 'Đăng tin bài' : 'Lưu cập nhật'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
