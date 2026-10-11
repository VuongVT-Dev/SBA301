// FUNewsManagementSystem - Sidebar Menu Navigation
// Cung cấp 5 khu vực quản lý cốt lõi: Dashboard, Category, News, Users, Settings

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Users,
  Settings,
  ChevronRight,
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, categories, news, users } = useApp();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Bảng điều khiển',
      sublabel: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'categories',
      label: 'Quản lý Danh mục',
      sublabel: 'Category Management',
      icon: FolderKanban,
      badge: categories.length,
    },
    {
      id: 'news',
      label: 'Quản lý Tin bài',
      sublabel: 'News Management',
      icon: Newspaper,
      badge: news.length,
    },
    {
      id: 'users',
      label: 'Quản lý Người dùng',
      sublabel: 'User Management',
      icon: Users,
      badge: users.length,
    },
    {
      id: 'settings',
      label: 'Cài đặt hệ thống',
      sublabel: 'System Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-section-label">ĐIỀU HƯỚNG QUẢN TRỊ</div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-item ${isActive ? 'nav-active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-item-icon">
                <Icon size={19} />
              </div>
              <div className="nav-item-content">
                <span className="nav-item-title">{item.label}</span>
                <span className="nav-item-sub">{item.sublabel}</span>
              </div>
              {item.badge !== null && (
                <span className={`nav-badge ${isActive ? 'badge-on-active' : ''}`}>
                  {item.badge}
                </span>
              )}
              <ChevronRight size={15} className="nav-arrow" />
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-course-tag">SBA301 • ASSIGNMENT 01</div>
        <div className="sidebar-version-tag">ReactJS Single Page App</div>
      </div>
    </aside>
  );
};
