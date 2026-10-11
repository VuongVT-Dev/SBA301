// FUNewsManagementSystem - Settings Page Component
// Cấu hình tài khoản, thông tin hệ thống, quản lý bộ nhớ LocalStorage

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoleBadge } from '../components/common/Badge';
import {
  Settings,
  User,
  Database,
  RotateCcw,
  Download,
  Info,
  CheckCircle,
  HardDrive,
  Code,
  Shield,
} from 'lucide-react';

export const SettingsPage = () => {
  const { currentUser, categories, news, users, resetToDefaultData, showToast } = useApp();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Tính toán dung lượng lưu trữ trong localStorage
  const getStorageSize = () => {
    let total = 0;
    try {
      for (const key in localStorage) {
        if (key.startsWith('funews_')) {
          total += (localStorage[key].length * 2); // UTF-16 characters
        }
      }
      return `${(total / 1024).toFixed(2)} KB`;
    } catch {
      return 'N/A';
    }
  };

  // Xuất dữ liệu ra file JSON
  const handleExportData = () => {
    const backupData = {
      system: 'FUNewsManagementSystem',
      exportedAt: new Date().toISOString(),
      currentUser,
      categories,
      news,
      users,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `funews_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    showToast('Đã xuất bản sao lưu dữ liệu JSON thành công!', 'success');
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <div className="page-breadcrumb">Quản lý hệ thống / Cài đặt</div>
          <h2 className="page-main-title">Cài đặt & Thông tin Hệ thống</h2>
          <p className="page-sub-title">
            Xem hồ sơ tài khoản hiện tại, kiểm tra dung lượng lưu trữ và xuất bản dữ liệu.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* User Profile Card */}
        <div className="card-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <User size={18} />
              <h3 className="panel-title">Thông tin Phiên đăng nhập</h3>
            </div>
          </div>
          <div className="settings-profile-body">
            <div className="profile-badge-row">
              <div className="profile-large-avatar">
                {currentUser?.role === 1 ? <Shield size={32} /> : <User size={32} />}
              </div>
              <div className="profile-info-col">
                <h4 className="profile-name">{currentUser?.fullName || currentUser?.username}</h4>
                <p className="profile-email">{currentUser?.email || 'Chưa cập nhật email'}</p>
                <div style={{ marginTop: '6px' }}>
                  <RoleBadge role={currentUser?.role} />
                </div>
              </div>
            </div>

            <div className="profile-detail-grid">
              <div className="profile-detail-item">
                <span className="detail-item-label">Tên đăng nhập:</span>
                <span className="detail-item-val font-mono">{currentUser?.username}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-item-label">Mã ID nhân sự:</span>
                <span className="detail-item-val font-mono">#{currentUser?.id}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-item-label">Trạng thái phiên:</span>
                <span className="detail-item-val status-online">Đang hoạt động (Authenticated)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Database & Mock Storage Info */}
        <div className="card-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <Database size={18} />
              <h3 className="panel-title">Quản trị Lưu trữ (LocalStorage)</h3>
            </div>
          </div>

          <div className="settings-storage-body">
            <div className="storage-stat-row">
              <div className="storage-stat-box">
                <HardDrive size={18} className="text-primary-color" />
                <div>
                  <div className="storage-val">{categories.length}</div>
                  <div className="storage-lbl">Danh mục</div>
                </div>
              </div>
              <div className="storage-stat-box">
                <HardDrive size={18} className="text-primary-color" />
                <div>
                  <div className="storage-val">{news.length}</div>
                  <div className="storage-lbl">Tin bài</div>
                </div>
              </div>
              <div className="storage-stat-box">
                <HardDrive size={18} className="text-primary-color" />
                <div>
                  <div className="storage-val">{users.length}</div>
                  <div className="storage-lbl">Tài khoản</div>
                </div>
              </div>
              <div className="storage-stat-box">
                <HardDrive size={18} className="text-primary-color" />
                <div>
                  <div className="storage-val">{getStorageSize()}</div>
                  <div className="storage-lbl">Kích thước cache</div>
                </div>
              </div>
            </div>

            <div className="settings-actions-row">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleExportData}
              >
                <Download size={16} />
                <span>Xuất dữ liệu JSON (Backup)</span>
              </button>

              <button
                type="button"
                className="btn btn-danger-outline"
                onClick={resetToDefaultData}
              >
                <RotateCcw size={16} />
                <span>Khôi phục dữ liệu gốc</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment & Project Technical Information */}
      <div className="card-panel" style={{ marginTop: '24px' }}>
        <div className="panel-header">
          <div className="panel-title-group">
            <Code size={18} />
            <h3 className="panel-title">Thông tin Dự án & Chuẩn kiến trúc SBA301</h3>
          </div>
        </div>

        <div className="project-info-grid">
          <div className="project-info-box">
            <span className="info-box-title">Học phần:</span>
            <span className="info-box-value">SBA301 – Integrate Single Page Application with Spring Boot</span>
          </div>
          <div className="project-info-box">
            <span className="info-box-title">Nội dung bài tập:</span>
            <span className="info-box-value">Assignment 01 – Working with ReactJS Application</span>
          </div>
          <div className="project-info-box">
            <span className="info-box-title">Chuẩn đầu ra (CLO):</span>
            <span className="info-box-value">CLO1 (Frontend React SPA), CLO2 (Data Integration & State Flow)</span>
          </div>
          <div className="project-info-box">
            <span className="info-box-title">Kiến trúc triển khai:</span>
            <span className="info-box-value">ReactJS 19 + Vite + Context API + Service Layer + LocalStorage</span>
          </div>
          <div className="project-info-box">
            <span className="info-box-title">Sẵn sàng tích hợp:</span>
            <span className="info-box-value">Service Layer sẵn sàng thay thế mock data bằng REST API Spring Boot</span>
          </div>
          <div className="project-info-box">
            <span className="info-box-title">Logo thương hiệu:</span>
            <span className="info-box-value">Tạo bằng AI (R04) và tích hợp tại Header & Login Page</span>
          </div>
        </div>
      </div>
    </div>
  );
};
