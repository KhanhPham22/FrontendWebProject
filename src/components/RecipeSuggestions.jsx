import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import RecipeImageItem from '../components/recipe/RecipeImageItem'; // Import RecipeImageItem
import { fetchRecipes } from '../services/api';

function RecipeSuggestions() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const loadSuggestions = async () => {
      const recipes = await fetchRecipes();
      const topRecipes = recipes.sort((a, b) => b.rating - a.rating).slice(0, 3);
      setSuggestions(topRecipes);
    };
    loadSuggestions();
  }, []);

  return (
    <div className="mt-4">
      <h3>Suggested for You</h3>
      <Row>
        {suggestions.map((recipe) => (
          <Col md={4} key={recipe.id} className="mb-4">
            <RecipeImageItem recipe={recipe} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default RecipeSuggestions;