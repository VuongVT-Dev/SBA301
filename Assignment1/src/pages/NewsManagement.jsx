// FUNewsManagementSystem - News Management Page
// CRUD tin tức, liên kết categoryId, tìm kiếm & lọc chuyên mục, modal dialog và confirmation

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SearchBar } from '../components/common/SearchBar';
import { StatusBadge } from '../components/common/Badge';
import { NewsModal } from '../components/modals/NewsModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Plus, Edit2, Trash2, Newspaper, Filter, Tag, Calendar, User } from 'lucide-react';

export const NewsManagement = () => {
  const { news, categories, currentUser, addNews, updateNews, deleteNews } = useApp();

  // State tìm kiếm & bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // State Modal CRUD
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // State Confirmation Xóa
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);

  // Helper lấy tên chuyên mục từ categoryId
  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.id === Number(catId));
    return cat ? cat.name : `Chuyên mục #${catId}`;
  };

  // Logic tìm kiếm và lọc: Giữ nguyên source list (news)
  const filteredNews = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return news.filter((item) => {
      // 1. Search theo title hoặc content hoặc tags
      const matchesSearch =
        !term ||
        (item.title && item.title.toLowerCase().includes(term)) ||
        (item.content && item.content.toLowerCase().includes(term)) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(term)));

      // 2. Filter theo Category
      const matchesCategory =
        selectedCategoryFilter === 'all' ||
        Number(item.categoryId) === Number(selectedCategoryFilter);

      // 3. Filter theo Status
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === '1' && Number(item.status) === 1) ||
        (statusFilter === '0' && Number(item.status) === 0);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [news, searchTerm, selectedCategoryFilter, statusFilter]);

  // Handlers mở modal Create
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedArticle(null);
    setModalOpen(true);
  };

  // Handlers mở modal Edit
  const handleOpenEdit = (article) => {
    setModalMode('update');
    setSelectedArticle(article);
    setModalOpen(true);
  };

  // Submit modal
  const handleModalSubmit = (formData) => {
    if (modalMode === 'create') {
      addNews(formData);
    } else if (modalMode === 'update' && selectedArticle) {
      updateNews(selectedArticle.id, formData);
    }
  };

  // Handlers mở Delete confirm
  const handleOpenDelete = (article) => {
    setArticleToDelete(article);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (articleToDelete) {
      deleteNews(articleToDelete.id);
      setArticleToDelete(null);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <div className="page-breadcrumb">Quản lý nội dung / Tin bài</div>
          <h2 className="page-main-title">Quản lý Tin bài & Bài viết</h2>
          <p className="page-sub-title">
            Soạn thảo, phân loại theo chuyên mục, xuất bản và tìm kiếm tin tức trên toàn hệ thống.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={18} />
          <span>Viết bài mới</span>
        </button>
      </div>

      {/* Filter and Search Panel */}
      <div className="filter-control-panel">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Tìm theo tiêu đề, nội dung hoặc tags (ví dụ: AI, DeepMind)..."
          totalCount={news.length}
          filteredCount={filteredNews.length}
        />

        <div className="filter-controls-row">
          <div className="filter-group">
            <Filter size={16} className="filter-icon" />
            <span className="filter-label">Chuyên mục:</span>
            <select
              className="filter-select"
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            >
              <option value="all">Tất cả chuyên mục ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <span className="filter-label">Trạng thái:</span>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả ({news.length})</option>
              <option value="1">Xuất bản ({news.filter((n) => Number(n.status) === 1).length})</option>
              <option value="0">Bản nháp ({news.filter((n) => Number(n.status) === 0).length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card-panel">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>ID</th>
                <th>Tiêu đề & Tóm tắt</th>
                <th style={{ width: '150px' }}>Chuyên mục</th>
                <th style={{ width: '130px' }}>Tác giả</th>
                <th style={{ width: '160px' }}>Tags</th>
                <th style={{ width: '120px' }} className="text-center">Trạng thái</th>
                <th style={{ width: '110px' }} className="text-center">Ngày đăng</th>
                <th style={{ width: '110px' }} className="text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="table-empty-box">
                      <div className="empty-icon-circle">
                        <Newspaper size={32} />
                      </div>
                      <h4 className="empty-title">Không tìm thấy bài viết nào</h4>
                      <p className="empty-desc">
                        {searchTerm.trim() || selectedCategoryFilter !== 'all' || statusFilter !== 'all'
                          ? 'Không có bài viết nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại.'
                          : 'Hiện chưa có bài viết nào trong hệ thống. Hãy bấm "Viết bài mới" để bắt đầu!'}
                      </p>
                      {(searchTerm.trim() || selectedCategoryFilter !== 'all' || statusFilter !== 'all') && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedCategoryFilter('all');
                            setStatusFilter('all');
                          }}
                        >
                          Xóa toàn bộ bộ lọc
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNews.map((article) => (
                  <tr key={article.id} className="table-row-hover">
                    <td className="font-mono text-muted">#{article.id}</td>
                    <td>
                      <div className="news-title-cell">
                        <span className="news-article-title">{article.title}</span>
                        <p className="news-article-preview">
                          {article.content ? article.content.substring(0, 95) + '...' : ''}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="category-pill">{getCategoryName(article.categoryId)}</span>
                    </td>
                    <td className="text-muted">
                      <div className="creator-cell">
                        <User size={13} />
                        <span>{article.createdBy}</span>
                      </div>
                    </td>
                    <td>
                      <div className="tags-container">
                        {article.tags && article.tags.length > 0 ? (
                          article.tags.map((t, idx) => (
                            <span key={idx} className="tag-chip">
                              <Tag size={10} />
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted font-italic">-</span>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="text-center font-mono text-muted">
                      <div className="date-cell">
                        <Calendar size={12} />
                        <span>{article.createdAt}</span>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="btn-action btn-action-edit"
                          onClick={() => handleOpenEdit(article)}
                          title="Chỉnh sửa bài viết"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-action-delete"
                          onClick={() => handleOpenDelete(article)}
                          title="Xóa bài viết"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-summary">
          <span>
            Hiển thị <strong>{filteredNews.length}</strong> trên tổng số {news.length} tin bài.
          </span>
        </div>
      </div>

      {/* CRUD Modal Dialog */}
      <NewsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        news={selectedArticle}
        categories={categories}
        mode={modalMode}
        currentUsername={currentUser?.username || 'Admin'}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa bài viết"
        itemName={articleToDelete?.title}
        message={`Bạn có chắc chắn muốn xóa bài viết "${articleToDelete?.title}" khỏi hệ thống?`}
      />
    </div>
  );
};
