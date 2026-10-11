// FUNewsManagementSystem - User Modal Dialog
// Tạo mới hoặc Cập nhật tài khoản người dùng, phân quyền Role và Status

import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { RotateCcw, Check } from 'lucide-react';

export const UserModal = ({ isOpen, onClose, onSubmit, user = null, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 2, // Mặc định 2 = Staff
    status: 1, // 1 = Active
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && mode === 'update') {
      setFormData({
        username: user.username || '',
        fullName: user.fullName || '',
        email: user.email || '',
        role: user.role !== undefined ? Number(user.role) : 2,
        status: user.status !== undefined ? Number(user.status) : 1,
      });
    } else {
      setFormData({
        username: '',
        fullName: '',
        email: '',
        role: 2,
        status: 1,
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'role' || name === 'status' ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleReset = () => {
    if (mode === 'update' && user) {
      setFormData({
        username: user.username || '',
        fullName: user.fullName || '',
        email: user.email || '',
        role: user.role !== undefined ? Number(user.role) : 2,
        status: user.status !== undefined ? Number(user.status) : 1,
      });
    } else {
      setFormData({
        username: '',
        fullName: '',
        email: '',
        role: 2,
        status: 1,
      });
    }
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Tên tài khoản không được để trống!';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Tên tài khoản phải từ 3 ký tự trở lên!';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống!';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống!';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Email không đúng định dạng (ví dụ: staff@funews.edu.vn)!';
      }
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

  const title = mode === 'create' ? 'Tạo mới tài khoản người dùng' : `Chỉnh sửa tài khoản: ${user?.username || ''}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="crud-form">
        {errors.form && <div className="form-error-alert">{errors.form}</div>}

        <div className="form-group">
          <label htmlFor="user-username" className="form-label required">
            Tên đăng nhập (Username)
          </label>
          <input
            id="user-username"
            name="username"
            type="text"
            className={`form-input ${errors.username ? 'input-error' : ''}`}
            placeholder="Ví dụ: staff_editor, reporter_01..."
            value={formData.username}
            onChange={handleChange}
            autoFocus
          />
          {errors.username && <span className="field-error-text">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="user-fullname" className="form-label required">
            Họ và tên đầy đủ
          </label>
          <input
            id="user-fullname"
            name="fullName"
            type="text"
            className={`form-input ${errors.fullName ? 'input-error' : ''}`}
            placeholder="Ví dụ: Nguyễn Văn An"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <span className="field-error-text">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="user-email" className="form-label required">
            Địa chỉ Email
          </label>
          <input
            id="user-email"
            name="email"
            type="email"
            className={`form-input ${errors.email ? 'input-error' : ''}`}
            placeholder="nguyenvanan@funews.edu.vn"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="field-error-text">{errors.email}</span>}
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="user-role" className="form-label">
              Vai trò & Quyền hạn
            </label>
            <select
              id="user-role"
              name="role"
              className="form-select"
              value={formData.role}
              onChange={handleChange}
            >
              <option value={1}>Role 1: Quản trị viên (Admin)</option>
              <option value={2}>Role 2: Nhân viên / Biên tập (Staff)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="user-status" className="form-label">
              Trạng thái tài khoản
            </label>
            <select
              id="user-status"
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value={1}>1 - Đang hoạt động (Active)</option>
              <option value={0}>0 - Khóa / Tạm dừng (Inactive)</option>
            </select>
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
            {mode === 'create' ? 'Tạo tài khoản' : 'Lưu cập nhật'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
