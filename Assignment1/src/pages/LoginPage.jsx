// FUNewsManagementSystem - Login Page Component
// Xử lý xác thực đăng nhập (Admin/Admin), validate form, mock session

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, User, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const errors = {};

    if (!username.trim()) {
      errors.username = 'Vui lòng nhập tên đăng nhập!';
    }
    if (!password.trim()) {
      errors.password = 'Vui lòng nhập mật khẩu!';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    const res = login(username, password);
    if (!res.success) {
      setErrorMessage(res.message || 'Đăng nhập không thành công!');
    }
  };

  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
    setFieldErrors({});
    setErrorMessage('');
  };

  return (
    <div className="login-page-container">
      <div className="login-card-wrapper">
        <div className="login-card-header">
          <div className="login-logo-container">
            <img src="/logo.jpg" alt="FUNews Logo" className="login-logo-img" />
          </div>
          <h1 className="login-main-title">FUNews Management System</h1>
          <p className="login-sub-title">Cổng đăng nhập hệ thống quản trị tin bài trực tuyến</p>
          <div className="login-badge-course">SBA301 • ASSIGNMENT 01 • REACTJS SPA</div>
        </div>

        {errorMessage && (
          <div className="login-error-banner" role="alert">
            <AlertCircle size={18} className="error-banner-icon" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form-body">
          <div className="login-field-group">
            <label htmlFor="login-username" className="login-field-label">
              Tên tài khoản (Username)
            </label>
            <div className={`login-input-box ${fieldErrors.username ? 'input-box-error' : ''}`}>
              <User size={18} className="input-box-icon" />
              <input
                id="login-username"
                type="text"
                className="login-input-control"
                placeholder="Nhập tên đăng nhập (ví dụ: Admin)"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: '' }));
                }}
                autoFocus
              />
            </div>
            {fieldErrors.username && (
              <span className="field-error-text">{fieldErrors.username}</span>
            )}
          </div>

          <div className="login-field-group">
            <label htmlFor="login-password" className="login-field-label">
              Mật khẩu (Password)
            </label>
            <div className={`login-input-box ${fieldErrors.password ? 'input-box-error' : ''}`}>
              <Lock size={18} className="input-box-icon" />
              <input
                id="login-password"
                type="password"
                className="login-input-control"
                placeholder="Nhập mật khẩu (ví dụ: Admin)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                }}
              />
            </div>
            {fieldErrors.password && (
              <span className="field-error-text">{fieldErrors.password}</span>
            )}
          </div>

          <button type="submit" className="btn-login-submit">
            <span>Đăng nhập hệ thống</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="login-quick-access">
          <div className="quick-access-title">
            <KeyRound size={14} />
            <span>Tài khoản kiểm thử nhanh (Demo Access)</span>
          </div>
          <div className="quick-access-buttons">
            <button
              type="button"
              className="btn-quick-fill admin-fill"
              onClick={() => handleQuickFill('Admin', 'Admin')}
            >
              <ShieldCheck size={14} />
              <span>Admin / Admin</span>
              <small>(Role 1: Toàn quyền)</small>
            </button>
            <button
              type="button"
              className="btn-quick-fill staff-fill"
              onClick={() => handleQuickFill('Staff', 'Staff')}
            >
              <User size={14} />
              <span>Staff / Staff</span>
              <small>(Role 2: Biên tập viên)</small>
            </button>
          </div>
        </div>

        <div className="login-footer-info">
          <span>FUNews Management System © 2026. Phục vụ đánh giá học phần SBA301.</span>
        </div>
      </div>
    </div>
  );
};
