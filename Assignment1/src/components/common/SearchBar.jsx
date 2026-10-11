// FUNewsManagementSystem - Search Bar Component
// Tìm kiếm chuẩn hóa (normalize trim/lowercase), không làm mất source list, có nút clear

import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Tìm kiếm...',
  totalCount,
  filteredCount,
}) => {
  const isFiltered = value && value.trim().length > 0;

  return (
    <div className="search-bar-wrapper">
      <div className="search-input-group">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        {isFiltered && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear}
            title="Xóa tìm kiếm"
            aria-label="Xóa tìm kiếm"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isFiltered && totalCount !== undefined && (
        <div className="search-count-hint">
          Tìm thấy <strong>{filteredCount}</strong> / {totalCount} kết quả
        </div>
      )}
    </div>
  );
};
