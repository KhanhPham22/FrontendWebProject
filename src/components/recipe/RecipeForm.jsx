import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Card } from 'react-bootstrap';
import { postRecipe } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function RecipeForm() {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: '',
    cookingTime: 0,
    servings: 1,
    category: 'Breakfast',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to create a recipe');
      return;
    }
    if (!recipe.title) {
      alert('Title is required');
      return;
    }
    try {
      await postRecipe({
        ...recipe,
        username: user.username,
        rating: 0,
        nutritionalInfo: { calories: 0, protein: 0, fat: 0, carbs: 0 },
        comments: [],
      });
      navigate('/');
    } catch (error) {
      alert('Failed to save recipe');
    }
  };

  return (
    <Card className="p-4 mt-4">
      <h2>Create Recipe</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={recipe.title}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={recipe.description}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Ingredients</Form.Label>
          {recipe.ingredients.map((ingredient, index) => (
            <Form.Control
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="mb-2"
              placeholder={`Ingredient ${index + 1}`}
            />
          ))}
          <Button variant="outline-primary" onClick={addIngredient}>
            Add Ingredient
          </Button>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Instructions</Form.Label>
          <Form.Control
            as="textarea"
            name="instructions"
            value={recipe.instructions}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cooking Time (minutes)</Form.Label>
          <Form.Control
            type="number"
            name="cookingTime"
            value={recipe.cookingTime}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Servings</Form.Label>
          <Form.Control
            type="number"
            name="servings"
            value={recipe.servings}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select name="category" value={recipe.category} onChange={handleInputChange}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Dessert">Dessert</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Recipe
        </Button>
      </Form>
    </Card>
  );
}

export default RecipeForm;