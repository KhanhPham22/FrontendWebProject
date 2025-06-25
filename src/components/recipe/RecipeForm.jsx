import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Card } from 'react-bootstrap';
import { postRecipe, updateRecipe } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function RecipeForm({ onRecipeAdded, onRecipeUpdated, editRecipe }) {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: '',
    cookingTime: 0,
    servings: 1,
    category: 'Breakfast',
    image: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (editRecipe) {
      setRecipe({
        ...editRecipe,
        ingredients: editRecipe.ingredients || [''],
      });
    }
  }, [editRecipe]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setRecipe({ ...recipe, image: file.name });
    }
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
      const recipeData = {
        ...recipe,
        username: user.username,
        rating: recipe.rating || 0,
        nutritionalInfo: recipe.nutritionalInfo || {
          calories: 0,
          protein: 0,
          fat: 0,
          carbs: 0,
        },
        comments: recipe.comments || [],
      };

      if (editRecipe) {
        await updateRecipe(editRecipe.id, recipeData);
        onRecipeUpdated({ ...recipeData, id: editRecipe.id });
      } else {
        const response = await postRecipe(recipeData);
        onRecipeAdded(response);
      }
      navigate('/recipemanagement');
    } catch (error) {
      alert('Failed to save recipe');
      console.error('Error saving recipe:', error);
    }
  };

  return (
    <Card className="p-4 mt-4">
      <h2>{editRecipe ? 'Edit Recipe' : 'Create Recipe'}</h2>
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

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {recipe.image && (
            <div className="mt-2">
              <img
                src={`/assets/images/${encodeURIComponent(recipe.image)}`}
                alt="Preview"
                style={{ maxWidth: '100px', maxHeight: '100px' }}
              />
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          {editRecipe ? 'Update Recipe' : 'Save Recipe'}
        </Button>
      </Form>
    </Card>
  );
}

export default RecipeForm;