// FUNewsManagementSystem - Delete Confirmation Dialog
// Hộp thoại xác nhận thao tác xóa theo yêu cầu R11 / Bước 9

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận xóa dữ liệu',
  message,
  itemName,
  confirmText = 'Xác nhận xóa',
  cancelText = 'Hủy bỏ',
  isDanger = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="480px">
      <div className="confirm-modal-content">
        <div className="confirm-icon-wrapper">
          <AlertTriangle size={32} className="confirm-icon-warning" />
        </div>
        <div className="confirm-text-wrapper">
          <p className="confirm-message">
            {message || 'Bạn có chắc chắn muốn xóa mục này khỏi hệ thống không?'}
          </p>
          {itemName && (
            <div className="confirm-highlight-item">
              <strong>Mục được chọn:</strong> <span>{itemName}</span>
            </div>
          )}
          <p className="confirm-subtext">
            Hành động này sẽ xóa dữ liệu khỏi danh sách và cập nhật bộ nhớ. Thao tác không thể hoàn tác nếu không khôi phục dữ liệu gốc.
          </p>
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          {cancelText}
        </button>
        <button
          type="button"
          className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
