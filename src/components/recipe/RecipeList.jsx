// RecipeList.jsx
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
import { useEffect } from "react";

function SortableRecipe({ recipe, onDelete, onEdit, showControls }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
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
          <RecipeImageItem
            recipe={recipe}
            showControls={showControls}
            onEdit={onEdit}
            onDelete={onDelete}
          />
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

  // 🩹 Đồng bộ lại order nếu có sự khác biệt giữa recipeOrder và recipes
  useEffect(() => {
    const currentIds = recipes.map((r) => r.id);
    const hasMissingIds = recipeOrder.some((id) => !currentIds.includes(id));
    const hasNewIds = currentIds.some((id) => !recipeOrder.includes(id));
    if (hasMissingIds || hasNewIds) {
      setRecipeOrder(currentIds); // cập nhật lại nếu không khớp
    }
  }, [recipes]);

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

  // Use orderedRecipes only when showControls is true
  const orderedRecipes = showControls
    ? recipeOrder
        .map((id) => recipes.find((recipe) => recipe.id === id))
        .filter((recipe) => recipe)
    : recipes; // Use original recipes order when showControls is false

  const content = (
    <div className="recipes-grid">
      {orderedRecipes.map((recipe) =>
        showControls ? (
          <div key={recipe.id}>
            <RecipeImageItem
              recipe={recipe}
              showControls={showControls}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ) : (
          <div key={recipe.id}>
            <RecipeImageItem recipe={recipe} />
          </div>
        )
      )}
    </div>
  );

  return showControls ? (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={recipeOrder}
        strategy={verticalListSortingStrategy}
      >
        {content}
      </SortableContext>
    </DndContext>
  ) : (
    content
  );
}

export default RecipeList;
