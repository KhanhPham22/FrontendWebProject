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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editRecipe) {
      setRecipe({
        ...editRecipe,
        ingredients: Array.isArray(editRecipe.ingredients) ? editRecipe.ingredients : [''],
        cookingTime: editRecipe.cookingTime || 0,
        servings: editRecipe.servings || 1,
        category: editRecipe.category || 'Breakfast',
        image: editRecipe.image || '/assets/images/placeholder.jpg'
      });
      setImageFile(null);
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
      setRecipe({ ...recipe, image: `/assets/images/${file.name}` });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (!user) {
      alert('Please login to create a recipe');
      setIsSubmitting(false);
      return;
    }
    if (!recipe.title) {
      alert('Title is required');
      setIsSubmitting(false);
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
        await updateRecipe(editRecipe.id, recipeData, imageFile);
        onRecipeUpdated({ ...recipeData, id: editRecipe.id });
      } else {
        const response = await postRecipe(recipeData, imageFile);
        onRecipeAdded(response);
      }
      // Reset form after successful submission
      setRecipe({
        title: '',
        description: '',
        ingredients: [''],
        instructions: '',
        cookingTime: 0,
        servings: 1,
        category: 'Breakfast',
        image: '',
      });
      setImageFile(null);
      navigate('/recipemanagement');
    } catch (error) {
      alert('Failed to save recipe: ' + (error.message || 'Unknown error'));
      console.error('Error saving recipe:', error);
    } finally {
      setIsSubmitting(false);
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
                src={recipe.image}
                alt="Preview"
                style={{ maxWidth: '100px', maxHeight: '100px' }}
                onError={(e) => {
                  console.log(`Image load failed for ${recipe.image}, falling back to placeholder`);
                  e.target.src = '/assets/images/placeholder.jpg';
                }}
              />
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {editRecipe ? 'Update Recipe' : 'Save Recipe'}
        </Button>
      </Form>
    </Card>
  );
}

export default RecipeForm;