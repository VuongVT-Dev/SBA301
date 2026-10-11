// FUNewsManagementSystem - Root Application
// Điều phối Authentication Guard và Master Navigation giữa các Tab quản trị

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CategoryManagement } from './pages/CategoryManagement';
import { NewsManagement } from './pages/NewsManagement';
import { UserManagement } from './pages/UserManagement';
import { SettingsPage } from './pages/SettingsPage';

const AppContent = () => {
  const { currentUser, activeTab } = useApp();

  // 1. Auth Guard: Nếu chưa đăng nhập -> Hiển thị Login Page
  if (!currentUser) {
    return <LoginPage />;
  }

  // 2. Render Page tương ứng với activeTab đã chọn trong Sidebar
  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'categories':
        return <CategoryManagement />;
      case 'news':
        return <NewsManagement />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  // 3. Layout Master quản trị
  return <AdminLayout>{renderCurrentPage()}</AdminLayout>;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
