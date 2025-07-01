// MealPlannerPage.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { Button, Offcanvas, Modal, Row, Col } from "react-bootstrap";
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
  const { startDrag } = useDrag();

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
      onClick={() => startDrag(recipe.id)}
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
  const [mealPlan, setMealPlan] = useLocalStorage("mealPlan", () => ({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  }));
  const [showModal, setShowModal] = useState(false);
  const isDragging = useRef(false);
  const { draggedRecipe, clearDrag } = useDrag();
  const [rawRecipes, setRawRecipes] = useState([]);

  useEffect(() => {
    if (draggedRecipe) {
      setShowModal(true);
    }
  }, [draggedRecipe]);

  // Changed: Synchronize mealPlan only when necessary
  useEffect(() => {
    setMealPlan((prev) => {
      const validRecipeIds = rawRecipes.map((r) => r.id);
      const updatedPlan = {};
      let hasChanges = false;

      Object.keys(prev).forEach((day) => {
        const filteredRecipes = prev[day]?.filter((id) => validRecipeIds.includes(id)) || [];
        updatedPlan[day] = filteredRecipes;
        if (JSON.stringify(filteredRecipes) !== JSON.stringify(prev[day])) {
          hasChanges = true;
        }
      });

      return hasChanges ? updatedPlan : prev;
    });
  }, [rawRecipes, setMealPlan]);

  const recipes = useMemo(() => {
    let data = [...rawRecipes];
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
    if (sort === "newest") {
      data.sort((a, b) => b.id - a.id);
    } else if (sort === "oldest") {
      data.sort((a, b) => a.id - b.id);
    } else if (sort === "rating-desc") {
      data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === "rating-asc") {
      data.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    } else if (sort === "title-asc") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "title-desc") {
      data.sort((a, b) => b.title.localeCompare(b.title));
    }
    return data;
  }, [rawRecipes, filters, sort, search]);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchRecipes();
        setRawRecipes(data);
      } catch (error) {
        console.error("Error loading recipes:", error);
        setRawRecipes([]);
      }
    };
    loadRecipes();
  }, []);

  const handleRemove = (recipeId, day) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: prev[day]?.filter((id) => id !== recipeId) || [],
    }));
  };

  const handleAssign = (recipeId, day) => {
    if (!recipeId || !day) return;
    setMealPlan((prev) => {
      const currentDay = Array.isArray(prev[day]) ? prev[day] : [];
      return {
        ...prev,
        [day]: [...currentDay, recipeId],
      };
    });
    clearDrag();
    setShowModal(false);
  };

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    isDragging.current = false;
    if (!over) {
      clearDrag();
      return;
    }

    const recipeId = active.id;
    const targetId = over.id;
    const targetDay = over?.data?.current?.day;

    console.log("Drag End:", { activeId: recipeId, overId: targetId, targetDay });

    setMealPlan((prev) => {
      let updatedPlan = { ...prev };

      if (targetDay) {
        const currentDay = Array.isArray(prev[targetDay]) ? prev[targetDay] : [];
        return {
          ...updatedPlan,
          [targetDay]: [...currentDay, recipeId],
        };
      }

      const sourceDay = Object.keys(prev).find((d) =>
        Array.isArray(prev[d]) && prev[d].includes(recipeId)
      );
      const destinationDay = Object.keys(prev).find((d) =>
        Array.isArray(prev[d]) && prev[d].includes(targetId)
      );

      if (sourceDay && destinationDay) {
        if (sourceDay === destinationDay) {
          const newOrder = [...prev[sourceDay]];
          const oldIndex = newOrder.indexOf(recipeId);
          const newIndex = newOrder.indexOf(targetId);
          if (oldIndex !== -1 && newIndex !== -1) {
            newOrder.splice(oldIndex, 1);
            newOrder.splice(newIndex, 0, recipeId);
            return {
              ...updatedPlan,
              [sourceDay]: newOrder,
            };
          }
        } else {
          const sourceRecipes = [...prev[sourceDay]].filter((id) => id !== recipeId);
          const destinationRecipes = [...prev[destinationDay]];
          const targetIndex = destinationRecipes.indexOf(targetId);
          destinationRecipes.splice(targetIndex, 0, recipeId);

          return {
            ...updatedPlan,
            [sourceDay]: sourceRecipes,
            [destinationDay]: destinationRecipes,
          };
        }
      }

      return prev;
    });

    clearDrag();
  };

  const handleOffcanvasHide = () => {
    if (!isDragging.current) {
      setShowRecipeList(false);
    }
  };

  return (
    <div>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          clearDrag();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Assign Recipe to Day</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
              (day) => (
                <Col md={4} key={day} className="mb-2">
                  <Button onClick={() => handleAssign(draggedRecipe, day)}>{day}</Button>
                </Col>
              )
            )}
          </Row>
        </Modal.Body>
      </Modal>
      <Navbar />
      <div className="meal-planner-container mt-4">
        <h2>Meal Planner</h2>
        <Button
          variant="primary"
          className="mb-3"
          onClick={() => setShowRecipeList(true)}
        >
          Choose Recipe
        </Button>
        <Offcanvas
          show={showRecipeList}
          onHide={handleOffcanvasHide}
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
          handleAssign={handleAssign}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
        />
      </div>
    </div>
  );
}

export default MealPlannerPage;