// FUNewsManagementSystem - Category Modal Dialog
// Tạo mới hoặc Cập nhật danh mục với modal popup và validation

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { RotateCcw, Check } from 'lucide-react';

export const CategoryModal = ({ isOpen, onClose, onSubmit, category = null, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 1,
  });
  const [errors, setErrors] = useState({});

  // Prefill dữ liệu khi ở mode update hoặc reset khi create
  useEffect(() => {
    if (category && mode === 'update') {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        status: category.status !== undefined ? Number(category.status) : 1,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 1,
      });
    }
    setErrors({});
  }, [category, mode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'status' ? Number(value) : value,
    }));
    // Xóa lỗi của trường đó khi người dùng bắt đầu sửa
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleReset = () => {
    if (mode === 'update' && category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        status: category.status !== undefined ? Number(category.status) : 1,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 1,
      });
    }
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên danh mục không được để trống!';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Tên danh mục phải có ít nhất 2 ký tự!';
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

  const title = mode === 'create' ? 'Thêm mới danh mục tin tức' : `Chỉnh sửa danh mục: ${category?.name || ''}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="crud-form">
        {errors.form && <div className="form-error-alert">{errors.form}</div>}

        <div className="form-group">
          <label htmlFor="cat-name" className="form-label required">
            Tên danh mục
          </label>
          <input
            id="cat-name"
            name="name"
            type="text"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            placeholder="Ví dụ: Công nghệ, Khoa học, Xã hội..."
            value={formData.name}
            onChange={handleChange}
            autoFocus
          />
          {errors.name && <span className="field-error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cat-desc" className="form-label">
            Mô tả danh mục
          </label>
          <textarea
            id="cat-desc"
            name="description"
            rows={3}
            className="form-textarea"
            placeholder="Mô tả phạm vi nội dung và các chủ đề tin tức thuộc danh mục này..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cat-status" className="form-label">
            Trạng thái hoạt động
          </label>
          <select
            id="cat-status"
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
          >
            <option value={1}>1 - Đang hoạt động (Active)</option>
            <option value={0}>0 - Tạm dừng / Ẩn (Inactive)</option>
          </select>
          <span className="field-help-text">
            Chỉ các danh mục "Hoạt động" mới được hiển thị cho độc giả và phóng viên tạo tin.
          </span>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleReset}
            title="Khôi phục lại giá trị ban đầu của form"
          >
            <RotateCcw size={16} /> Đặt lại
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Hủy bỏ
          </button>
          <button type="submit" className="btn btn-primary">
            <Check size={16} />
            {mode === 'create' ? 'Tạo danh mục' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
