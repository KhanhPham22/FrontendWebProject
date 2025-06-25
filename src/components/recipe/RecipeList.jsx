// components/recipe/RecipeList.jsx
import { Row, Col } from "react-bootstrap";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import RecipeImageItem from "./RecipeImageItem";

function SortableRecipe({ recipe, onDelete, onEdit, showControls }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: recipe.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Col md={4} className="mb-4 d-flex">
        <div className="w-100">
          <RecipeImageItem recipe={recipe} />
          {showControls && (
            <div className="d-flex justify-content-between mt-2">
              <button className="btn btn-outline-primary" onClick={() => onEdit(recipe)}>
                Edit
              </button>
              <button className="btn btn-outline-danger" onClick={() => onDelete(recipe)}>
                Delete
              </button>
            </div>
          )}
        </div>
      </Col>
    </div>
  );
}

function RecipeList({ recipes, onDelete, onEdit, showControls = false }) {
  const [recipeOrder, setRecipeOrder] = useLocalStorage(
    "recipeOrder",
    recipes.map((r) => r.id)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = recipeOrder.indexOf(active.id);
    const newIndex = recipeOrder.indexOf(over.id);
    const newOrder = [...recipeOrder];
    newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, active.id);
    setRecipeOrder(newOrder);
  };

  const orderedRecipes = recipeOrder
    .map((id) => recipes.find((recipe) => recipe.id === id))
    .filter((recipe) => recipe);

  const content = (
    <Row>
      {orderedRecipes.map((recipe) => (
        <SortableRecipe
          key={recipe.id}
          recipe={recipe}
          onDelete={onDelete}
          onEdit={onEdit}
          showControls={showControls}
        />
      ))}
    </Row>
  );

  // Drag & Drop chỉ dùng khi có controls
  return showControls ? (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={orderedRecipes.map((r) => r.id)} strategy={verticalListSortingStrategy}>
        {content}
      </SortableContext>
    </DndContext>
  ) : (
    content
  );
}

export default RecipeList;
