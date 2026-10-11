// FUNewsManagementSystem - Dashboard Page Component (NexLink Design)
// Tổng quan thống kê hệ thống: Tin tức, Danh mục, Người dùng, Hoạt động gần đây

import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/Badge';
import {
  Newspaper,
  FolderKanban,
  Users,
  TrendingUp,
  PlusCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export const DashboardPage = () => {
  const { categories, news, users, setActiveTab, currentUser } = useApp();

  // Thống kê số liệu
  const activeNews = news.filter((n) => Number(n.status) === 1).length;
  const inactiveNews = news.length - activeNews;

  const activeCategories = categories.filter((c) => Number(c.status) === 1).length;
  const inactiveCategories = categories.length - activeCategories;

  const adminUsers = users.filter((u) => Number(u.role) === 1).length;
  const staffUsers = users.filter((u) => Number(u.role) === 2).length;

  const recentNews = [...news].slice(0, 5);

  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.id === Number(catId));
    return cat ? cat.name : `Danh mục #${catId}`;
  };

  return (
    <div className="page-wrapper">
      {/* Top Welcome Banner */}
      <div className="dashboard-hero-banner">
        <div className="hero-content">
          <div className="hero-greeting">
            <Sparkles className="hero-sparkle-icon" size={18} />
            <span>Xin chào, <strong>{currentUser?.fullName || currentUser?.username}</strong>!</span>
          </div>
          <h2 className="hero-headline">Bảng điều khiển Trung tâm FUNews</h2>
          <p className="hero-subline">
            Hệ thống quản lý nội dung đa phương tiện, chuyên mục báo chí và phân quyền người dùng
            theo chuẩn giao diện hiện đại NexLink.
          </p>
        </div>
        <div className="hero-badge-tag">
          <ShieldCheck size={16} />
          <span>Phiên làm việc: {currentUser?.role === 1 ? 'Administrator' : 'Staff Member'}</span>
        </div>
      </div>

      {/* KPI Cards Grid with NexLink Trend Bar Visuals */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tổng bài viết</span>
            <div className="stat-icon-box stat-icon-news">
              <Newspaper size={20} />
            </div>
          </div>
          <div className="stat-value">{news.length}</div>
          <div className="stat-footer">
            <span className="stat-highlight positive">{activeNews} hoạt động</span>
            <span className="stat-separator">•</span>
            <span className="stat-muted">{inactiveNews} ẩn / nháp</span>
          </div>
          {/* Mini Chart Bars like NexLink */}
          <div className="stat-mini-chart">
            <div className="stat-chart-bar" style={{ height: '40%' }} />
            <div className="stat-chart-bar" style={{ height: '65%' }} />
            <div className="stat-chart-bar active" style={{ height: '100%' }} />
            <div className="stat-chart-bar active" style={{ height: '80%' }} />
            <div className="stat-chart-bar" style={{ height: '55%' }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tổng chuyên mục</span>
            <div className="stat-icon-box stat-icon-cat">
              <FolderKanban size={20} />
            </div>
          </div>
          <div className="stat-value">{categories.length}</div>
          <div className="stat-footer">
            <span className="stat-highlight positive">{activeCategories} hoạt động</span>
            <span className="stat-separator">•</span>
            <span className="stat-muted">{inactiveCategories} tạm dừng</span>
          </div>
          <div className="stat-mini-chart">
            <div className="stat-chart-bar" style={{ height: '35%' }} />
            <div className="stat-chart-bar" style={{ height: '50%' }} />
            <div className="stat-chart-bar active" style={{ height: '90%' }} />
            <div className="stat-chart-bar" style={{ height: '70%' }} />
            <div className="stat-chart-bar active" style={{ height: '100%' }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tài khoản nhân sự</span>
            <div className="stat-icon-box stat-icon-users">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-value">{users.length}</div>
          <div className="stat-footer">
            <span className="stat-highlight role-admin-color">{adminUsers} Quản trị viên</span>
            <span className="stat-separator">•</span>
            <span className="stat-muted">{staffUsers} Biên tập viên</span>
          </div>
          <div className="stat-mini-chart">
            <div className="stat-chart-bar" style={{ height: '60%' }} />
            <div className="stat-chart-bar active" style={{ height: '85%' }} />
            <div className="stat-chart-bar" style={{ height: '45%' }} />
            <div className="stat-chart-bar active" style={{ height: '100%' }} />
            <div className="stat-chart-bar" style={{ height: '75%' }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tỷ lệ xuất bản</span>
            <div className="stat-icon-box stat-icon-trend">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-value">
            {news.length > 0 ? Math.round((activeNews / news.length) * 100) : 0}%
          </div>
          <div className="stat-footer">
            <span className="stat-highlight positive">Đồng bộ LocalStorage</span>
            <span className="stat-separator">•</span>
            <span className="stat-muted">Sẵn sàng API</span>
          </div>
          <div className="stat-mini-chart">
            <div className="stat-chart-bar" style={{ height: '40%' }} />
            <div className="stat-chart-bar" style={{ height: '60%' }} />
            <div className="stat-chart-bar" style={{ height: '75%' }} />
            <div className="stat-chart-bar active" style={{ height: '90%' }} />
            <div className="stat-chart-bar active" style={{ height: '100%' }} />
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="quick-actions-bar">
        <div className="quick-actions-title">
          <Zap size={16} style={{ color: '#5b58ff' }} />
          <span>Thao tác nhanh</span>
        </div>
        <div className="quick-action-buttons">
          <button
            type="button"
            className="quick-action-btn"
            onClick={() => setActiveTab('news')}
          >
            <Newspaper size={16} />
            <span>Xem & Viết bài mới</span>
          </button>
          <button
            type="button"
            className="quick-action-btn"
            onClick={() => setActiveTab('categories')}
          >
            <FolderKanban size={16} />
            <span>Thêm chuyên mục</span>
          </button>
          {currentUser?.role === 1 && (
            <button
              type="button"
              className="quick-action-btn"
              onClick={() => setActiveTab('users')}
            >
              <Users size={16} />
              <span>Quản lý tài khoản</span>
            </button>
          )}
        </div>
      </div>

      {/* Recent News & Category Distribution */}
      <div className="dashboard-tables-grid">
        <div className="card-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <Clock size={18} style={{ color: '#5b58ff' }} />
              <h3 className="panel-title">Bài viết xuất bản gần đây</h3>
            </div>
            <button
              type="button"
              className="btn-link"
              onClick={() => setActiveTab('news')}
            >
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tiêu đề tin tức</th>
                  <th>Chuyên mục</th>
                  <th>Tác giả</th>
                  <th>Trạng thái</th>
                  <th>Ngày đăng</th>
                </tr>
              </thead>
              <tbody>
                {recentNews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center empty-state-row">
                      Chưa có bài viết nào trong hệ thống.
                    </td>
                  </tr>
                ) : (
                  recentNews.map((item) => (
                    <tr key={item.id} className="table-row-hover">
                      <td className="font-mono text-muted">#{item.id}</td>
                      <td className="font-semibold text-primary-text">{item.title}</td>
                      <td>
                        <span className="category-pill">{getCategoryName(item.categoryId)}</span>
                      </td>
                      <td className="text-muted">{item.createdBy}</td>
                      <td>
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="text-muted font-mono">{item.createdAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown Sidebar Card */}
        <div className="card-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <FolderKanban size={18} style={{ color: '#5b58ff' }} />
              <h3 className="panel-title">Phân bổ chuyên mục</h3>
            </div>
            <button
              type="button"
              className="btn-link"
              onClick={() => setActiveTab('categories')}
            >
              <span>Chi tiết</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="category-distribution-list">
            {categories.map((cat) => {
              const count = news.filter((n) => Number(n.categoryId) === cat.id).length;
              const percentage = news.length > 0 ? Math.round((count / news.length) * 100) : 0;
              return (
                <div key={cat.id} className="category-dist-item">
                  <div className="category-dist-info">
                    <span className="category-dist-name">{cat.name}</span>
                    <span className="category-dist-count">{count} bài viết ({percentage}%)</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
