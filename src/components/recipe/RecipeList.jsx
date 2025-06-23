import { useState } from "react";
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

function SortableRecipe({ recipe }) {
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
      <RecipeImageItem recipe={recipe} />
    </div>
  );
}

function RecipeList({ recipes }) {
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

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div>
        <h2>Recipes</h2>
        <Row>
          {recipes.map((recipe) => (
            <Col md={4} className="mb-4" key={recipe.id}>
              <RecipeImageItem recipe={recipe} />
            </Col>
          ))}
        </Row>
      </div>
    </DndContext>
  );
}

export default RecipeList;
