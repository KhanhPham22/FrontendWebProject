import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <div className="card mb-4">
      <img src={`/images/${recipe.image}`} className="card-img-top" alt={recipe.title} />
      <div className="card-body">
        <h5 className="card-title">{recipe.title}</h5>
        <p className="card-text">{recipe.description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="badge">Rating: {recipe.rating}/5</span>
          <Link to={`/recipe/${recipe.id}`} className="btn btn-primary">
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;