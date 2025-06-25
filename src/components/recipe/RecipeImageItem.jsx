// RecipeImageItem.jsx
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";
import FavoriteButton from "./FavoriteButton";

function RecipeImageItem({ recipe, showControls = false, onEdit, onDelete }) {
  const imageUrl = `/assets/images/${encodeURIComponent(recipe.image || "placeholder.jpg")}`;

  return (
    <Card className="h-100 shadow-sm w-100">
      <Card.Img
        variant="top"
        src={imageUrl}
        alt={recipe.title}
        onError={(e) => {
          console.log(`Image load failed for ${imageUrl}, falling back to placeholder`);
          e.target.src = "/assets/images/placeholder.jpg"; // Fallback
        }}
        style={{ height: "250px", objectFit: "cover" }}
      />
      <Card.Body className="d-flex flex-column justify-content-between">
        <div>
          <Card.Title className="text-center">{recipe.title}</Card.Title>
          <Card.Text className="text-muted text-center">
            Cooking Time: {recipe.cookingTime} min
          </Card.Text>
          <div className="text-center">
            <RatingStars rating={recipe.rating} recipeId={recipe.id} />
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          {showControls ? (
            <>
              <Button
                variant="outline-primary"
                onClick={() => onEdit(recipe)}
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => onDelete(recipe)}
              >
                Delete
              </Button>
            </>
          ) : (
            <>
              <Link to={`/recipe/${recipe.id}`} className="btn btn-primary">
                View Details
              </Link>
              <FavoriteButton recipeId={recipe.id} />
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default RecipeImageItem;