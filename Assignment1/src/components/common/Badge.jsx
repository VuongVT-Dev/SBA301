// FUNewsManagementSystem - Badge Component
// Hiển thị nhãn trực quan cho Status (Active/Inactive) và Role (Admin/Staff)

import React from 'react';

export const StatusBadge = ({ status }) => {
  const isActive = Number(status) === 1;
  return (
    <span
      className={`badge ${isActive ? 'badge-active' : 'badge-inactive'}`}
      title={isActive ? 'Trạng thái: Đang hoạt động' : 'Trạng thái: Tạm dừng / Ẩn'}
    >
      <span className="badge-dot" />
      {isActive ? 'Hoạt động' : 'Tạm dừng'}
    </span>
  );
};

export const RoleBadge = ({ role }) => {
  const isAdmin = Number(role) === 1;
  return (
    <span
      className={`badge ${isAdmin ? 'badge-role-admin' : 'badge-role-staff'}`}
      title={isAdmin ? 'Quyền: Toàn quyền Quản trị hệ thống' : 'Quyền: Biên tập viên / Nhân viên'}
    >
      {isAdmin ? 'Quản trị viên (Admin)' : 'Nhân viên (Staff)'}
    </span>
  );
};
