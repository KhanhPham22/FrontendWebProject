import { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { fetchRecipes } from '../services/api';

function FavoritesPage() {
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const allRecipes = await fetchRecipes();
      const favoriteRecipes = allRecipes.filter((recipe) =>
        favorites.includes(recipe.id)
      );
      setRecipes(favoriteRecipes);
    };
    loadFavorites();
  }, [favorites]);

  return (
    <div className="mt-4">
      <h2>Favorite Recipes</h2>
      {recipes.length === 0 ? (
        <p>No favorite recipes yet.</p>
      ) : (
        <Row>
          {recipes.map((recipe) => (
            <Col md={4} key={recipe.id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{recipe.title}</Card.Title>
                  <Card.Text>{recipe.description}</Card.Text>
                  <Link to={`/recipe/${recipe.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default FavoritesPage;