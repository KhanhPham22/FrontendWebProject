import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import RecipeImageItem from "../components/recipe/RecipeImageItem";
import { fetchRecipes } from "../services/api";

function RecipeSuggestions() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const loadSuggestions = async () => {
      const recipes = await fetchRecipes();
      const topRecipes = recipes.sort((a, b) => b.rating - a.rating).slice(0, 9); // Lấy 9 món top
      setSuggestions(topRecipes);
    };
    loadSuggestions();
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
    <div className="mt-4">
      <h3>Suggested for You</h3>
      <Carousel
        responsive={responsive}
        infinite
        autoPlay={false}
        arrows
        keyBoardControl
        containerClass="carousel-container"
        itemClass="px-2"
      >
        {suggestions.map((recipe) => (
          <div key={recipe.id}>
            <RecipeImageItem recipe={recipe} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default RecipeSuggestions;
