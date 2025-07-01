import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { fetchRecipes, deleteRecipe } from '../services/api';
import FavoriteButton from '../components/recipe/FavoriteButton';
import RatingStars from '../components/recipe/RatingStars';
import CommentForm from '../components/recipe/CommentForm';
import CommentList from '../components/recipe/CommentList';
import ShareButtons from '../components/shared/ShareButtons';
import NutritionInfo from '../components/shared/NutritionInfo';
import Navbar from '../components/Navbar'; // Import Navbar
import './RecipeDetailPage.css';

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const loadRecipe = useCallback(async () => {
    try {
      const recipes = await fetchRecipes();
      const foundRecipe = recipes.find((r) => r.id.toString() === id);
      if (!foundRecipe) {
        setError('Recipe not found');
        return;
      }
      setRecipe(foundRecipe);
    } catch (err) {
      setError('Failed to load recipe');
    }
  }, [id]);

  useEffect(() => {
    loadRecipe();
  }, [loadRecipe]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe(id);
        navigate('/');
      } catch (error) {
        alert('Failed to delete recipe');
      }
    }
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!recipe) return <div>Loading...</div>;

  return (
    <>
      <Navbar /> {/* Add Navbar at the top */}
      <div className="recipe-detail-container">
        <Card className="recipe-card">
          <Card.Img
            variant="top"
            src={`/assets/images/${encodeURIComponent(recipe.image || 'placeholder.jpg')}`}
            alt={recipe.title}
            onError={(e) => {
              e.target.src = '/assets/images/placeholder.jpg';
            }}
            className="recipe-image"
          />
          <Card.Body>
            <Row>
              <Col md={8}>
                <Card.Title className="recipe-title">{recipe.title}</Card.Title>
                <Card.Text className="recipe-description">{recipe.description}</Card.Text>
                <h5>Ingredients</h5>
                <ul className="ingredient-list">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                <h5>Instructions</h5>
                <p className="recipe-instructions">{recipe.instructions}</p>
                <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
                <p><strong>Servings:</strong> {recipe.servings}</p>
                <p><strong>Category:</strong> {recipe.category}</p>
                <NutritionInfo nutritionalInfo={recipe.nutritionalInfo} servings={recipe.servings} />
              </Col>
              <Col md={4} className="recipe-sidebar">
                <FavoriteButton recipeId={recipe.id} />
                <RatingStars recipeId={recipe.id} rating={recipe.rating} />
                <ShareButtons recipe={recipe} />
                <Button variant="danger" onClick={handleDelete} className="mt-3 w-100">
                  Delete Recipe
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <CommentForm recipeId={recipe.id} onCommentPosted={loadRecipe} />
        <CommentList comments={recipe.comments} />
      </div>
    </>
  );
}

export default RecipeDetailPage;