// FUNewsManagementSystem - Header Component
// Chứa AI Logo, tiêu đề thương hiệu, hồ sơ người dùng và nút Đăng xuất

import React from 'react';
import { useApp } from '../../context/AppContext';
import { RoleBadge } from '../common/Badge';
import { LogOut, RotateCcw, User, ShieldCheck } from 'lucide-react';

export const Header = () => {
  const { currentUser, logout, resetToDefaultData } = useApp();

  return (
    <header className="app-header">
      <div className="header-brand">
        <img
          src="/logo.jpg"
          alt="FUNews Management System Logo"
          className="header-logo"
          onError={(e) => {
            // Fallback nếu ảnh logo chưa tải được
            e.target.style.display = 'none';
          }}
        />
        <div className="header-brand-text">
          <div className="header-title">FUNews Management System</div>
          <div className="header-subtitle">Cổng quản trị tin tức & nội dung số FPT University</div>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="btn-header-action"
          onClick={resetToDefaultData}
          title="Khôi phục dữ liệu mẫu ban đầu (phục vụ test & demo)"
        >
          <RotateCcw size={15} />
          <span>Reset Mock Data</span>
        </button>

        {currentUser && (
          <div className="header-user-profile">
            <div className="user-avatar">
              {currentUser.role === 1 ? <ShieldCheck size={18} /> : <User size={18} />}
            </div>
            <div className="user-details">
              <span className="user-name">{currentUser.fullName || currentUser.username}</span>
              <RoleBadge role={currentUser.role} />
            </div>
          </div>
        )}

        <button
          type="button"
          className="btn-logout"
          onClick={logout}
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};
