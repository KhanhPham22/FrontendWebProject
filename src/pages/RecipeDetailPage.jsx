import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { fetchRecipes, deleteRecipe } from '../services/api';
import FavoriteButton from '../components/recipe/FavoriteButton';
import RatingStars from '../components/recipe/RatingStars';
import CommentForm from '../components/recipe/CommentForm';
import CommentList from '../components/recipe/CommentList';
import ShareButtons from '../components/shared/ShareButtons';
import NutritionInfo from '../components/shared/NutritionInfo';

function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const loadRecipe = async () => {
      const recipes = await fetchRecipes();
      const foundRecipe = recipes.find((r) => r.id === parseInt(id));
      setRecipe(foundRecipe);
    };
    loadRecipe();
  }, [id]);

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

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="mt-4">
      <Card>
        <Card.Body>
          <Row>
            <Col md={8}>
              <Card.Title>{recipe.title}</Card.Title>
              <Card.Text>{recipe.description}</Card.Text>
              <h5>Ingredients</h5>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h5>Instructions</h5>
              <p>{recipe.instructions}</p>
              <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
              <p><strong>Servings:</strong> {recipe.servings}</p>
              <p><strong>Category:</strong> {recipe.category}</p>
              <NutritionInfo nutritionalInfo={recipe.nutritionalInfo} servings={recipe.servings} />
            </Col>
            <Col md={4}>
              <FavoriteButton recipeId={recipe.id} />
              <RatingStars recipeId={recipe.id} rating={recipe.rating} />
              <ShareButtons recipe={recipe} />
              <Button variant="danger" onClick={handleDelete} className="mt-3">
                Delete Recipe
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <CommentForm recipeId={recipe.id} />
      <CommentList comments={recipe.comments} />
    </div>
  );
}

export default RecipeDetailPage;