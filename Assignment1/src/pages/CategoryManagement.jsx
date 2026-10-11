// FUNewsManagementSystem - Category Management Page
// CRUD danh mục, tìm kiếm chuẩn hóa, modal tạo/sửa và xác nhận xóa

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SearchBar } from '../components/common/SearchBar';
import { StatusBadge } from '../components/common/Badge';
import { CategoryModal } from '../components/modals/CategoryModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, FolderKanban, Filter, AlertCircle } from 'lucide-react';

export const CategoryManagement = () => {
  const { categories, news, addCategory, updateCategory, deleteCategory } = useApp();

  // State tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | '1' | '0'

  // State Modal CRUD
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'update'
  const [selectedCategory, setSelectedCategory] = useState(null);

  // State Delete Confirmation Modal
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Tính số bài viết của từng danh mục
  const getNewsCount = (catId) => {
    return news.filter((n) => Number(n.categoryId) === Number(catId)).length;
  };

  // Logic tìm kiếm & lọc: KHÔNG mutate mảng gốc (source list)
  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return categories.filter((cat) => {
      // 1. Lọc theo từ khóa tìm kiếm (tên danh mục)
      const matchesSearch = !term || (cat.name && cat.name.toLowerCase().includes(term));

      // 2. Lọc theo trạng thái
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === '1' && Number(cat.status) === 1) ||
        (statusFilter === '0' && Number(cat.status) === 0);

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  // Handlers mở modal Create
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedCategory(null);
    setModalOpen(true);
  };

  // Handlers mở modal Update
  const handleOpenEdit = (cat) => {
    setModalMode('update');
    setSelectedCategory(cat);
    setModalOpen(true);
  };

  // Handler Submit Create / Update
  const handleModalSubmit = (formData) => {
    if (modalMode === 'create') {
      addCategory(formData);
    } else if (modalMode === 'update' && selectedCategory) {
      updateCategory(selectedCategory.id, formData);
    }
  };

  // Handlers mở dialog Xóa
  const handleOpenDelete = (cat) => {
    setCategoryToDelete(cat);
    setConfirmDeleteOpen(true);
  };

  // Xác nhận xóa
  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <div className="page-breadcrumb">Quản lý nội dung / Danh mục</div>
          <h2 className="page-main-title">Quản lý Danh mục Tin tức</h2>
          <p className="page-sub-title">
            Thêm, chỉnh sửa, xóa và tìm kiếm các chuyên mục báo chí trên hệ thống FUNews.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          <span>Thêm danh mục mới</span>
        </button>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div className="filter-control-panel">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Tìm danh mục theo tên (ví dụ: Thế giới, Công nghệ)..."
          totalCount={categories.length}
          filteredCount={filteredCategories.length}
        />

        <div className="filter-group">
          <Filter size={16} className="filter-icon" />
          <span className="filter-label">Trạng thái:</span>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả ({categories.length})</option>
            <option value="1">Đang hoạt động ({categories.filter((c) => Number(c.status) === 1).length})</option>
            <option value="0">Tạm dừng ({categories.filter((c) => Number(c.status) === 0).length})</option>
          </select>
        </div>
      </div>

      {/* Data Table Panel */}
      <div className="card-panel">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '220px' }}>Tên danh mục</th>
                <th>Mô tả chuyên mục</th>
                <th style={{ width: '130px' }} className="text-center">Số bài viết</th>
                <th style={{ width: '140px' }} className="text-center">Trạng thái</th>
                <th style={{ width: '120px' }} className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="table-empty-box">
                      <div className="empty-icon-circle">
                        <FolderKanban size={32} />
                      </div>
                      <h4 className="empty-title">Không tìm thấy danh mục nào</h4>
                      <p className="empty-desc">
                        {searchTerm.trim()
                          ? `Không có kết quả nào khớp với từ khóa "${searchTerm}". Hãy thử từ khóa khác hoặc xóa bộ lọc.`
                          : 'Hiện chưa có danh mục nào trong hệ thống. Hãy tạo danh mục đầu tiên!'}
                      </p>
                      {searchTerm.trim() && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setSearchTerm('')}
                        >
                          Xóa tìm kiếm
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const newsCount = getNewsCount(cat.id);
                  return (
                    <tr key={cat.id} className="table-row-hover">
                      <td className="font-mono text-muted">#{cat.id}</td>
                      <td className="font-semibold text-primary-text">
                        <div className="category-cell-name">
                          <FolderKanban size={16} className="cell-icon-cat" />
                          <span>{cat.name}</span>
                        </div>
                      </td>
                      <td className="text-muted-dark">{cat.description || <em>(Chưa có mô tả)</em>}</td>
                      <td className="text-center">
                        <span className={`count-badge ${newsCount > 0 ? 'count-has-items' : 'count-empty'}`}>
                          {newsCount} tin bài
                        </span>
                      </td>
                      <td className="text-center">
                        <StatusBadge status={cat.status} />
                      </td>
                      <td className="text-right">
                        <div className="action-buttons-group">
                          <button
                            type="button"
                            className="btn-action btn-action-edit"
                            onClick={() => handleOpenEdit(cat)}
                            title="Chỉnh sửa danh mục"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-action btn-action-delete"
                            onClick={() => handleOpenDelete(cat)}
                            title="Xóa danh mục"
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
            Hiển thị <strong>{filteredCategories.length}</strong> trên tổng số {categories.length} danh mục.
          </span>
        </div>
      </div>

      {/* CRUD Modal Dialog */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        category={selectedCategory}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa danh mục"
        itemName={categoryToDelete?.name}
        message={
          categoryToDelete && getNewsCount(categoryToDelete.id) > 0
            ? `CẢNH BÁO: Danh mục "${categoryToDelete.name}" đang có ${getNewsCount(
                categoryToDelete.id
              )} bài viết liên quan. Việc xóa có thể ảnh hưởng đến các bài viết này!`
            : `Bạn có chắc chắn muốn xóa danh mục "${categoryToDelete?.name}" khỏi hệ thống không?`
        }
      />
    </div>
  );
};
