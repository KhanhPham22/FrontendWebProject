import { Form } from 'react-bootstrap';

function SearchInput({ onSearch }) {
  return (
    <Form.Group className="mb-4">
      <Form.Control
        type="text"
        placeholder="Search by title, description, or ingredient..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </Form.Group>
  );
}

export default SearchInput;