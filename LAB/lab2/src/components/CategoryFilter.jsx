import { Form } from 'react-bootstrap';

export default function CategoryFilter({
  categories = [],
  selectedCategory,
  onCategoryChange,
  specialOnly,
  onSpecialOnlyChange
}) {
  return (
    <div className="d-flex flex-wrap align-items-center gap-3">
      <Form.Select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        style={{ minWidth: '180px', width: 'auto' }}
        aria-label="Chọn danh mục"
      >
        <option value="ALL">Tất cả danh mục</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </Form.Select>

      <Form.Check
        type="checkbox"
        id="special-only-check"
        label="Chỉ hoa đặc biệt (Special)"
        checked={specialOnly}
        onChange={(e) => onSpecialOnlyChange(e.target.checked)}
      />
    </div>
  );
}
