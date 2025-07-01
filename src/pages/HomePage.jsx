import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDrag } from '../context/DragContext';
import RecipeList from '../components/recipe/RecipeList';
import Navbar from '../components/Navbar';
import FilterBar from '../components/recipe/FilterBar';
import SortDropdown from '../components/recipe/SortDropdown';
import SearchInput from '../components/recipe/SearchInput';
import RecipeSuggestions from '../components/RecipeSuggestions';
import { fetchRecipes } from '../services/api';
import './HomePage.css';

function SortableRecipe({ recipe }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: recipe.id });
  const { startDrag } = useDrag();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-2"
      onClick={() => startDrag(recipe.id)}
    >
      <RecipeList recipes={[recipe]} showControls={false} />
    </div>
  );
}

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        let data = await fetchRecipes();
        if (filters.category) {
          data = data.filter((recipe) => recipe.category === filters.category);
        }
        if (filters.cookingTime) {
          data = data.filter((recipe) => recipe.cookingTime <= parseInt(filters.cookingTime));
        }
        if (filters.servings) {
          data = data.filter((recipe) => recipe.servings === parseInt(filters.servings));
        }
        if (search) {
          const lowerSearch = search.toLowerCase();
          data = data.filter(
            (recipe) =>
              recipe.title.toLowerCase().includes(lowerSearch) ||
              recipe.description.toLowerCase().includes(lowerSearch) ||
              recipe.ingredients.some((ing) => ing.toLowerCase().includes(lowerSearch))
          );
        }
        if (sort === 'newest') {
          data.sort((a, b) => b.id - a.id);
        } else if (sort === 'oldest') {
          data.sort((a, b) => a.id - b.id);
        } else if (sort === 'rating-desc') {
          data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sort === 'rating-asc') {
          data.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        } else if (sort === 'title-asc') {
          data.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === 'title-desc') {
          data.sort((a, b) => b.title.localeCompare(b.title));
        }
        setRecipes(data);
      } catch (error) {
        console.error('Error loading recipes:', error);
        setRecipes([]);
      }
    };
    loadRecipes();
  }, [filters, sort, search]);

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-header">
          <h1>Recipe Sharing Website</h1>
        </div>
        <div className="controls-container">
          <FilterBar onFilterChange={setFilters} />
          <SortDropdown onSortChange={setSort} />
          <SearchInput onSearch={setSearch} />
        </div>
        <h2>Recipes</h2>
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <SortableRecipe key={recipe.id} recipe={recipe} />
          ))}
        </div>
        <RecipeSuggestions />
      </div>
    </>
  );
}

export default HomePage;