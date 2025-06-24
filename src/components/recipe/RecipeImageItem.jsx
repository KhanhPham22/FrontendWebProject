import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import RatingStars from "./RatingStars";

function RecipeImageItem({ recipe }) {
  const imageUrl = `/assets/images/${encodeURIComponent(recipe.image || "")}`;
  console.log("Image URL:", imageUrl); // Log for debugging
  return (
    <Col md={6} className="mb-4">
      <Card className="h-100 shadow-sm">
        <Card.Img
          variant="top"
          src={imageUrl}
          alt={recipe.title}
          style={{ height: "250px", objectFit: "cover", width: "100%" }}
          onError={(e) => {
            console.error("Image failed to load:", e.target.src);
           e.target.src = "/assets/images/placeholder.jpg"; // Fallback image
          }}
        />
        <Card.Body>
          <Card.Title className="text-center">{recipe.title}</Card.Title>
          <Card.Text className="text-muted text-center">
            Cooking Time: {recipe.cookingTime} min
          </Card.Text>
          <RatingStars recipeId={recipe.id} rating={recipe.rating} />
          <div className="d-flex justify-content-between align-items-center mt-2 gap-2">
            <Link to={`/recipe/${recipe.id}`} className="btn btn-primary w-50">
              View Details
            </Link>
            <div className="w-50 text-end">
              <FavoriteButton recipeId={recipe.id} />
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default RecipeImageItem;
