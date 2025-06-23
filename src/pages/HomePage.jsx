import { useState, useEffect } from "react";
import RecipeList from "../components/recipe/RecipeList";
import FilterBar from "../components/recipe/FilterBar";
import SortDropdown from "../components/recipe/SortDropdown";
import SearchInput from "../components/recipe/SearchInput";
import RecipeSuggestions from "../components/RecipeSuggestions";
import ThemeToggle from "../components/shared/ThemeToggle";
import "./HomePage.css";
import { fetchRecipes } from "../services/api";

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadRecipes = async () => {
      let data = await fetchRecipes();

      // Apply filters
      if (filters.category) {
        data = data.filter((recipe) => recipe.category === filters.category);
      }
      if (filters.cookingTime) {
        data = data.filter(
          (recipe) => recipe.cookingTime <= parseInt(filters.cookingTime)
        );
      }
      if (filters.servings) {
        data = data.filter(
          (recipe) => recipe.servings === parseInt(filters.servings)
        );
      }

      // Apply search
      if (search) {
        const lowerSearch = search.toLowerCase();
        data = data.filter(
          (recipe) =>
            recipe.title.toLowerCase().includes(lowerSearch) ||
            recipe.description.toLowerCase().includes(lowerSearch) ||
            recipe.ingredients.some((ing) =>
              ing.toLowerCase().includes(lowerSearch)
            )
        );
      }

      // Apply sorting
      if (sort === "newest") {
        data.sort((a, b) => b.id - a.id);
      } else if (sort === "oldest") {
        data.sort((a, b) => a.id - b.id);
      } else if (sort === "rating-desc") {
        data.sort((a, b) => b.rating - a.rating);
      } else if (sort === "rating-asc") {
        data.sort((a, b) => a.rating - b.rating);
      } else if (sort === "title-asc") {
        data.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sort === "title-desc") {
        data.sort((a, b) => b.title.localeCompare(a.title));
      }

      setRecipes(data);
    };
    loadRecipes();
  }, [filters, sort, search]);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Recipe Sharing Website</h1>
        <ThemeToggle />
      </div>
      <FilterBar onFilterChange={setFilters} />
      <SortDropdown onSortChange={setSort} />
      <SearchInput onSearch={setSearch} />
      <RecipeList recipes={recipes} />
      <RecipeSuggestions />
    </div>
  );
}

export default HomePage;
