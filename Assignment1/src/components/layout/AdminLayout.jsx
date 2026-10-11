// FUNewsManagementSystem - Admin Master Layout
// Khung giao diện master tích hợp Header, Sidebar, Content Area và Toast

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const AdminLayout = ({ children }) => {
  const { toast, setToast } = useApp();

  return (
    <div className="admin-layout-root">
      <Header />
      <div className="admin-layout-body">
        <Sidebar />
        <main className="admin-content-area" role="main">
          {children}
        </main>
      </div>

      {/* Toast Notification Box */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`} role="alert">
          <div className="toast-icon">
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'warning' && <AlertCircle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
          </div>
          <div className="toast-message">{toast.message}</div>
          <button
            type="button"
            className="toast-close"
            onClick={() => setToast(null)}
            aria-label="Đóng thông báo"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
};
