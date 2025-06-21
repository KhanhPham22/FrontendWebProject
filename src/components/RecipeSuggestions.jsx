import { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
            <Card>
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <Card.Text>Rating: {recipe.rating.toFixed(1)}</Card.Text>
                <Link to={`/recipe/${recipe.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default RecipeSuggestions;