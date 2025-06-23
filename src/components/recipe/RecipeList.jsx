import { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useLocalStorage } from '../../hooks/useLocalStorage';

function SortableRecipe({ recipe }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: recipe.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Col md={4} key={recipe.id} className="mb-4" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="h-100 shadow-sm">
        <Card.Img
          variant="top"
          src={`assets/images/${recipe.image}`}

          alt={recipe.title}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <Card.Body>
          <Card.Title>{recipe.title}</Card.Title>
          <Card.Text className="text-muted">{recipe.description}</Card.Text>
          <Link to={`/recipe/${recipe.id}`} className="btn btn-primary w-100">
            View Details
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
}


function RecipeList({ recipes }) {
  const [recipeOrder, setRecipeOrder] = useLocalStorage('recipeOrder', recipes.map((r) => r.id));

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
          <SortableContext items={recipeOrder} strategy={verticalListSortingStrategy}>
            {orderedRecipes.map((recipe) => (
              <SortableRecipe key={recipe.id} recipe={recipe} />
            ))}
          </SortableContext>
        </Row>
      </div>
    </DndContext>
  );
}

export default RecipeList;