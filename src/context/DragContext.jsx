import { createContext, useContext, useState } from 'react';

const DragContext = createContext();

export function DragProvider({ children }) {
  const [draggedRecipe, setDraggedRecipe] = useState(null);

  const startDrag = (recipeId) => {
    setDraggedRecipe(recipeId);
  };

  const clearDrag = () => {
    setDraggedRecipe(null);
  };

  return (
    <DragContext.Provider value={{ draggedRecipe, startDrag, clearDrag }}>
      {children}
    </DragContext.Provider>
  );
}

export function useDrag() {
  return useContext(DragContext);
}