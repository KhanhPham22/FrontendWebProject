import { useState } from 'react';
import { Card } from 'react-bootstrap';

function NutritionInfo({ nutritionalInfo, servings }) {
  const [viewPerServing, setViewPerServing] = useState(true);

  const { calories, protein, fat, carbs } = nutritionalInfo;
  const displayValues = viewPerServing
    ? { calories: calories / servings, protein: protein / servings, fat: fat / servings, carbs: carbs / servings }
    : nutritionalInfo;

  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>Nutritional Information</Card.Title>
        <div>
          <label>
            <input
              type="checkbox"
              checked={viewPerServing}
              onChange={() => setViewPerServing(!viewPerServing)}
            />
            View Per Serving
          </label>
        </div>
        <p>Calories: {displayValues.calories.toFixed(1)} kcal</p>
        <p>Protein: {displayValues.protein.toFixed(1)} g</p>
        <p>Fat: {displayValues.fat.toFixed(1)} g</p>
        <p>Carbs: {displayValues.carbs.toFixed(1)} g</p>
      </Card.Body>
    </Card>
  );
}

export default NutritionInfo;