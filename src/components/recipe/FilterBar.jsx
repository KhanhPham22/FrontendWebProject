import { Form } from 'react-bootstrap';

function FilterBar({ onFilterChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <Form className="d-flex mb-4">
      <Form.Group className="me-3">
        <Form.Label>Category</Form.Label>
        <Form.Select name="category" onChange={handleChange}>
          <option value="">All</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Dessert">Dessert</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="me-3">
        <Form.Label>Cooking Time (minutes)</Form.Label>
        <Form.Control
          type="number"
          name="cookingTime"
          placeholder="Max time"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Servings</Form.Label>
        <Form.Control
          type="number"
          name="servings"
          placeholder="Servings"
          onChange={handleChange}
        />
      </Form.Group>
    </Form>
  );
}

export default FilterBar;