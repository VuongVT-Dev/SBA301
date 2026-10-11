// FUNewsManagementSystem - User Management Page
// CRUD người dùng, phân quyền Role (1: Admin, 2: Staff), tìm kiếm & modal dialog

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SearchBar } from '../components/common/SearchBar';
import { StatusBadge, RoleBadge } from '../components/common/Badge';
import { UserModal } from '../components/modals/UserModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, Users, Filter, Mail, ShieldAlert } from 'lucide-react';

export const UserManagement = () => {
  const { users, currentUser, addUser, updateUser, deleteUser, showToast } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);

  // Delete modal state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Search & filter logic: Giữ nguyên source list
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return users.filter((u) => {
      // 1. Search username, fullName hoặc email
      const matchesSearch =
        !term ||
        (u.username && u.username.toLowerCase().includes(term)) ||
        (u.fullName && u.fullName.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term));

      // 2. Filter theo Role
      const matchesRole =
        roleFilter === 'all' ||
        (roleFilter === '1' && Number(u.role) === 1) ||
        (roleFilter === '2' && Number(u.role) === 2);

      // 3. Filter theo Status
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === '1' && Number(u.status) === 1) ||
        (statusFilter === '0' && Number(u.status) === 0);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setModalMode('update');
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (modalMode === 'create') {
      addUser(formData);
    } else if (modalMode === 'update' && selectedUser) {
      updateUser(selectedUser.id, formData);
    }
  };

  const handleOpenDelete = (user) => {
    if (currentUser?.id === user.id) {
      showToast('Bạn không thể tự xóa tài khoản đang đăng nhập trong phiên hiện tại!', 'warning');
      return;
    }
    setUserToDelete(user);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <div className="page-breadcrumb">Quản lý hệ thống / Tài khoản người dùng</div>
          <h2 className="page-main-title">Quản lý Tài khoản & Phân quyền</h2>
          <p className="page-sub-title">
            Quản trị danh sách nhân sự, phân định vai trò Quản trị viên (Admin) và Biên tập viên (Staff).
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          <span>Thêm người dùng</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-control-panel">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Tìm theo username, họ tên, email (ví dụ: admin, hoang_nam)..."
          totalCount={users.length}
          filteredCount={filteredUsers.length}
        />

        <div className="filter-controls-row">
          <div className="filter-group">
            <Filter size={16} className="filter-icon" />
            <span className="filter-label">Vai trò:</span>
            <select
              className="filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tất cả vai trò ({users.length})</option>
              <option value="1">Quản trị viên - Admin ({users.filter((u) => Number(u.role) === 1).length})</option>
              <option value="2">Biên tập viên - Staff ({users.filter((u) => Number(u.role) === 2).length})</option>
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Trạng thái:</span>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả ({users.length})</option>
              <option value="1">Hoạt động ({users.filter((u) => Number(u.status) === 1).length})</option>
              <option value="0">Tạm khóa ({users.filter((u) => Number(u.status) === 0).length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card-panel">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>ID</th>
                <th style={{ width: '180px' }}>Tên đăng nhập</th>
                <th>Họ và tên</th>
                <th>Email liên hệ</th>
                <th style={{ width: '180px' }}>Vai trò (Role)</th>
                <th style={{ width: '130px' }} className="text-center">Trạng thái</th>
                <th style={{ width: '110px' }} className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="table-empty-box">
                      <div className="empty-icon-circle">
                        <Users size={32} />
                      </div>
                      <h4 className="empty-title">Không tìm thấy tài khoản người dùng</h4>
                      <p className="empty-desc">
                        Không có người dùng nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại.
                      </p>
                      {(searchTerm.trim() || roleFilter !== 'all' || statusFilter !== 'all') && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setSearchTerm('');
                            setRoleFilter('all');
                            setStatusFilter('all');
                          }}
                        >
                          Xóa bộ lọc
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isCurrentSessionUser = currentUser?.id === user.id;

                  return (
                    <tr key={user.id} className="table-row-hover">
                      <td className="font-mono text-muted">#{user.id}</td>
                      <td className="font-semibold text-primary-text">
                        <div className="user-username-cell">
                          <span>{user.username}</span>
                          {isCurrentSessionUser && (
                            <span className="current-user-tag" title="Tài khoản bạn đang sử dụng">
                              (Bạn)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="font-medium">{user.fullName}</td>
                      <td>
                        <div className="email-cell">
                          <Mail size={13} className="text-muted" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td>
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="text-center">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="text-right">
                        <div className="action-buttons-group">
                          <button
                            type="button"
                            className="btn-action btn-action-edit"
                            onClick={() => handleOpenEdit(user)}
                            title="Chỉnh sửa tài khoản"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-action btn-action-delete"
                            onClick={() => handleOpenDelete(user)}
                            disabled={isCurrentSessionUser}
                            title={
                              isCurrentSessionUser
                                ? 'Không thể xóa tài khoản của chính mình'
                                : 'Xóa tài khoản'
                            }
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-summary">
          <span>
            Hiển thị <strong>{filteredUsers.length}</strong> trên tổng số {users.length} tài khoản.
          </span>
        </div>
      </div>

      {/* CRUD Modal */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        user={selectedUser}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa tài khoản người dùng"
        itemName={userToDelete ? `${userToDelete.fullName} (@${userToDelete.username})` : ''}
        message={`Bạn có chắc chắn muốn xóa tài khoản "${userToDelete?.username}" khỏi hệ thống?`}
      />
    </div>
  );
};
