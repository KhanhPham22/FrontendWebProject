import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Row, Col } from 'react-bootstrap';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { fetchRecipes } from '../../services/api';

function SortableRecipe({ recipe }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: recipe.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-2">
      <Card.Body>{recipe.title}</Card.Body>
    </Card>
  );
}

function CalendarView() {
  const [mealPlan, setMealPlan] = useLocalStorage('mealPlan', {
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [],
  });
  const [recipes, setRecipes] = useState([]);
  const [nutritionSummary, setNutritionSummary] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });

  useEffect(() => {
    const loadRecipes = async () => {
      const data = await fetchRecipes();
      setRecipes(data);

      // Calculate total nutrition
      const summary = { calories: 0, protein: 0, fat: 0, carbs: 0 };
      Object.values(mealPlan).flat().forEach((recipeId) => {
        const recipe = data.find((r) => r.id === recipeId);
        if (recipe && recipe.nutritionalInfo) {
          summary.calories += recipe.nutritionalInfo.calories;
          summary.protein += recipe.nutritionalInfo.protein;
          summary.fat += recipe.nutritionalInfo.fat;
          summary.carbs += recipe.nutritionalInfo.carbs;
        }
      });
      setNutritionSummary(summary);
    };
    loadRecipes();
  }, [mealPlan]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const sourceDay = active.data.current.day;
    const targetDay = over.data.current.day;
    const recipeId = active.id;

    if (sourceDay !== targetDay) {
      setMealPlan((prev) => ({
        ...prev,
        [sourceDay]: prev[sourceDay].filter((id) => id !== recipeId),
        [targetDay]: [...prev[targetDay], recipeId],
      }));
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
  <DndContext onDragEnd={handleDragEnd}>
    <div>
      <Row>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Weekly Nutrition Summary</Card.Title>
              <p>Calories: {nutritionSummary.calories.toFixed(1)} kcal</p>
              <p>Protein: {nutritionSummary.protein.toFixed(1)} g</p>
              <p>Fat: {nutritionSummary.fat.toFixed(1)} g</p>
              <p>Carbs: {nutritionSummary.carbs.toFixed(1)} g</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        {days.map((day) => (
          <Col md={4} key={day} className="mb-4">
            <Card>
              <Card.Header>{day}</Card.Header>
              <Card.Body>
                <SortableContext
                  items={mealPlan[day]}
                  strategy={verticalListSortingStrategy}
                >
                  {mealPlan[day].map((recipeId) => {
                    const recipe = recipes.find((r) => r.id === recipeId);
                    return recipe ? <SortableRecipe key={recipeId} recipe={{ ...recipe, day }} /> : null;
                  })}
                </SortableContext>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  </DndContext>
);

}

export default CalendarView;