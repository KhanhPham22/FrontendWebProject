import { useState, useEffect, useMemo } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { DndContext, rectIntersection, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDrag } from "../context/DragContext";
import Navbar from "../components/Navbar";
import CalendarView from "../components/mealPlanner/CalendarView";
import RecipeList from "../components/recipe/RecipeList";
import FilterBar from "../components/recipe/FilterBar";
import SortDropdown from "../components/recipe/SortDropdown";
import SearchInput from "../components/recipe/SearchInput";
import { fetchRecipes } from "../services/api";
import { useLocalStorage } from "../hooks/useLocalStorage";
import "./MealPlannerPage.css";

function SortableRecipe({ recipe }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: recipe.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-2"
    >
      <RecipeList recipes={[recipe]} showControls={false} />
    </div>
  );
}

function MealPlannerPage() {
  const [showRecipeList, setShowRecipeList] = useState(false);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [mealPlan, setMealPlan] = useLocalStorage("mealPlan", {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const { draggedRecipe, clearDrag } = useDrag();
  const [rawRecipes, setRawRecipes] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchRecipes();
        setRawRecipes(data);
      } catch (error) {
        console.error("Error loading recipes:", error);
      }
    };
    loadRecipes();
  }, []);

  useEffect(() => {
    if (rawRecipes.length === 0) return; // Prevent resetting mealPlan if no recipes
    setMealPlan((prev) => {
      const validIds = rawRecipes.map((r) => r.id);
      const updatedPlan = {};
      let changed = false;

      Object.keys(prev).forEach((day) => {
        const filtered = prev[day]?.filter((id) => validIds.includes(id)) || [];
        updatedPlan[day] = filtered;
        if (JSON.stringify(filtered) !== JSON.stringify(prev[day])) {
          changed = true;
        }
      });

      return changed ? updatedPlan : prev;
    });
  }, [rawRecipes, setMealPlan]);

  const recipes = useMemo(() => {
    let data = [...rawRecipes];
    if (filters.category) {
      data = data.filter((r) => r.category === filters.category);
    }
    if (filters.cookingTime) {
      data = data.filter((r) => r.cookingTime <= parseInt(filters.cookingTime));
    }
    if (filters.servings) {
      data = data.filter((r) => r.servings === parseInt(filters.servings));
    }
    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.title.toLowerCase().includes(s) ||
          r.description.toLowerCase().includes(s) ||
          r.ingredients.some((ing) => ing.toLowerCase().includes(s))
      );
    }
    if (sort === "newest") data.sort((a, b) => b.id - a.id);
    else if (sort === "oldest") data.sort((a, b) => a.id - b.id);
    else if (sort === "rating-desc") data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === "rating-asc") data.sort((a, b) => (a.rating || 0) - (a.rating || 0));
    else if (sort === "title-asc") data.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "title-desc") data.sort((a, b) => b.title.localeCompare(a.title));
    return data;
  }, [rawRecipes, filters, sort, search]);

  const handleRemove = (recipeId, day) => {
    setMealPlan((prev) => {
      const newPlan = {
        ...prev,
        [day]: prev[day]?.filter((id) => id !== recipeId) || [],
      };
      return newPlan;
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log("DragEnd Event:", { active, over });

    if (!over) {
      console.log("No drop target detected");
      return;
    }

    const recipeId = active.id;
    const targetDay = over?.data?.current?.day;

    console.log("Drop:", recipeId, "->", targetDay);

    if (targetDay) {
      setMealPlan((prev) => {
        const newPlan = {
          ...prev,
          [targetDay]: [...(prev[targetDay] || []), recipeId],
        };
        return newPlan;
      });
      clearDrag();
    } else {
      console.log("Target day is undefined");
    }
  };

  return (
    <>
      <Navbar />
      <div className="meal-planner-container mt-4">
        <h2>Meal Planner</h2>
        <Button variant="primary" className="mb-3" onClick={() => setShowRecipeList(true)}>
          Choose Recipe
        </Button>

        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragEnd={handleDragEnd}
        >
          <Offcanvas
            show={showRecipeList}
            onHide={() => setShowRecipeList(false)}
            placement="end"
            className="recipe-offcanvas"
            backdrop="static"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Choose a Recipe</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="controls-container">
                <FilterBar onFilterChange={setFilters} />
                <SortDropdown onSortChange={setSort} />
                <SearchInput onSearch={setSearch} />
              </div>
              <SortableContext
                items={recipes.map((r) => r.id)}
                strategy={verticalListSortingStrategy}
              >
                {recipes.map((recipe) => (
                  <SortableRecipe key={recipe.id} recipe={recipe} />
                ))}
              </SortableContext>
            </Offcanvas.Body>
          </Offcanvas>

          <CalendarView
            mealPlan={mealPlan}
            recipes={recipes}
            handleRemove={handleRemove}
          />
        </DndContext>
      </div>
    </>
  );
}

export default MealPlannerPage;