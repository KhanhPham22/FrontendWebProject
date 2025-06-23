// src/components/recipe/RecipeImageItem.jsx
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function RecipeImageItem({ recipe }) {
  const imageUrl = `/assets/images/${encodeURIComponent(recipe.image || "")}`;
  console.log("Image URL:", imageUrl); // ✅ In ra URL để chắc chắn
  return (
    <Col md={6} className="mb-4">
      <Card className="h-100 shadow-sm">
        <Card.Img
          variant="top"
          src={imageUrl} // Sử dụng proxy để trỏ đến json-server
          alt={recipe.title}
          style={{ height: "250px", objectFit: "cover", width: "100%" }}
          onError={(e) => {
            console.error("Image failed to load:", e.target.src);
            e.target.src = "https://via.placeholder.com/200"; // Fallback image
          }}
        />
        <Card.Body>
          <Card.Title className="text-center">{recipe.title}</Card.Title>
          <Link to={`/recipe/${recipe.id}`} className="btn btn-primary w-100">
            View Details
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default RecipeImageItem;
