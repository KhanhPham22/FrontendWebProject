import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, Row, Col, Button, Image } from "react-bootstrap";

function SortableRecipe({ recipeId, recipes, day, handleRemove }) {
  const recipe = recipes.find((r) => r.id === recipeId);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: recipeId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!recipe) return null;
  const imageUrl = `/assets/images/${encodeURIComponent(
    recipe.image || "placeholder.jpg"
  )}`;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-2 position-relative ${isDragging ? "dragging" : ""}`}
    >
      <Card.Body className="d-flex align-items-center">
        <Image
          src={imageUrl}
          alt={recipe.title}
          onError={(e) => {
            console.log(`Image load failed for ${imageUrl}, falling back to placeholder`);
            e.target.src = "/assets/images/placeholder.jpg";
          }}
          style={{
            width: "40px",
            height: "40px",
            objectFit: "cover",
            marginRight: "10px",
          }}
          rounded
        />
        <div className="flex-grow-1">{recipe.title}</div>
        <Button
          variant="danger"
          size="sm"
          className="position-absolute top-0 end-0 m-1 remove-button"
          onClick={(e) => {
            e.stopPropagation();
            handleRemove(recipeId, day);
          }}
        >
          X
        </Button>
      </Card.Body>
    </Card>
  );
}

function DropBox({
  day,
  recipes,
  mealPlan,
  handleRemove,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: day,
    data: { day },
  });

  return (
    <Card
      className={`drop-target ${isOver ? "bg-light" : ""}`}
      style={{
        minHeight: "120px",
        padding: "10px",
        width: "200px", /* Fixed width for each day card */
      }}
    >
      <div ref={setNodeRef} style={{ minHeight: "100%" }}>
        <Card.Header>{day}</Card.Header>
        <Card.Body>
          {mealPlan[day]?.length > 0 ? (
            <SortableContext
              items={mealPlan[day]}
              strategy={verticalListSortingStrategy}
            >
              {mealPlan[day].map((recipeId) => (
                <SortableRecipe
                  key={recipeId}
                  recipeId={recipeId}
                  recipes={recipes}
                  day={day}
                  handleRemove={handleRemove}
                />
              ))}
            </SortableContext>
          ) : (
            <p className="text-muted">Drop recipes here</p>
          )}
        </Card.Body>
      </div>
    </Card>
  );
}

function CalendarView({
  mealPlan,
  recipes,
  handleRemove,
}) {
  const nutritionSummary = useMemo(() => {
    const summary = { calories: 0, protein: 0, fat: 0, carbs: 0 };
    Object.values(mealPlan)
      .flat()
      .forEach((recipeId) => {
        const recipe = recipes.find((r) => r.id === recipeId);
        if (recipe && recipe.nutritionalInfo) {
          summary.calories += recipe.nutritionalInfo.calories || 0;
          summary.protein += recipe.nutritionalInfo.protein || 0;
          summary.fat += recipe.nutritionalInfo.fat || 0;
          summary.carbs += recipe.nutritionalInfo.carbs || 0;
        }
      });
    return {
      calories: summary.calories.toFixed(1),
      protein: summary.protein.toFixed(1),
      fat: summary.fat.toFixed(1),
      carbs: summary.carbs.toFixed(1),
    };
  }, [mealPlan, recipes]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div>
      <Row className="mb-4">
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Card.Title>Weekly Nutrition Summary</Card.Title>
              <p>Calories: {nutritionSummary.calories} kcal</p>
              <p>Protein: {nutritionSummary.protein} g</p>
              <p>Fat: {nutritionSummary.fat} g</p>
              <p>Carbs: {nutritionSummary.carbs} g</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "15px",
          padding: "10px",
          flexWrap: "nowrap",
        }}
        className="scrollable-calendar"
      >
        {days.map((day) => (
          <div key={day} style={{ flex: "0 0 auto" }}>
            <DropBox
              day={day}
              recipes={recipes}
              mealPlan={mealPlan}
              handleRemove={handleRemove}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarView;