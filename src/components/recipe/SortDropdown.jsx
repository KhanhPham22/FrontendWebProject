import { Form } from 'react-bootstrap';

function SortDropdown({ onSortChange }) {
  return (
    <Form.Group className="mb-4">
      <Form.Label>Sort By</Form.Label>
      <Form.Select onChange={(e) => onSortChange(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="rating-desc">Highest Rating</option>
        <option value="rating-asc">Lowest Rating</option>
        <option value="title-asc">Title A-Z</option>
        <option value="title-desc">Title Z-A</option>
      </Form.Select>
    </Form.Group>
  );
}

export default SortDropdown;