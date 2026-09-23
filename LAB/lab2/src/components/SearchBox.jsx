import { Form } from 'react-bootstrap';

export default function SearchBox({ keyword, onKeywordChange }) {
  return (
    <Form.Group className="mb-0 flex-grow-1">
      <Form.Control
        type="search"
        placeholder="Tìm kiếm theo tên hoa lan..."
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
      />
    </Form.Group>
  );
}
