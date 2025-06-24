import { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { fetchRecipes } from "../services/api";
import RatingStars from "../components/recipe/RatingStars";
import FavoriteButton from "../components/recipe/FavoriteButton";
import Navbar from "../components/Navbar";
import "./FavoritesPage.css";

function FavoritesPage() {
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
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
    <>
      <Navbar />
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>Favorite Recipes</h1>
        </div>
        {recipes.length === 0 ? (
          <p>No favorite recipes yet.</p>
        ) : (
          <Row>
            {recipes.map((recipe) => (
              <Col md={4} key={recipe.id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={
                      recipe.image
                        ? `/assets/images/${encodeURIComponent(recipe.image)}`
                        : "/assets/images/placeholder.jpg"
                    }
                    alt={recipe.title}
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      width: "100%",
                    }}
                    onError={(e) => {
                      console.error("Image failed to load:", e.target.src);
                      e.target.src = "/assets/images/placeholder.jpg"; // fallback local
                    }}
                  />
                  <Card.Body>
                    <Card.Title className="text-center">
                      {recipe.title}
                    </Card.Title>
                    <Card.Text className="text-muted text-center">
                      Cooking Time: {recipe.cookingTime} min
                    </Card.Text>
                    <RatingStars recipeId={recipe.id} rating={recipe.rating} />
                    <div className="d-flex justify-content-between align-items-center">
                      <Link
                        to={`/recipe/${recipe.id}`}
                        className="btn btn-primary"
                      >
                        View Details
                      </Link>
                      <FavoriteButton recipeId={recipe.id} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </>
  );
}

export default FavoritesPage;
