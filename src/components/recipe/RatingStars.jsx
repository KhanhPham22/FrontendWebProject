import { useState } from 'react';
import { BsStar, BsStarFill } from 'react-icons/bs';
import { updateRecipe } from '../../services/api';

function RatingStars({ recipeId, rating }) {
  const [userRating, setUserRating] = useState(0);

  const handleRating = async (star) => {
    setUserRating(star);
    try {
      // Giả sử API lưu trữ rating trung bình, gửi rating mới để cập nhật
      await updateRecipe(recipeId, { rating: star });
    } catch (error) {
      alert('Failed to submit rating');
    }
  };

  return (
    <div className="mb-3">
      <span>Average Rating: {rating.toFixed(1)}</span>
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{ cursor: 'pointer' }}
            onClick={() => handleRating(star)}
          >
            {star <= userRating ? <BsStarFill className="text-warning" /> : <BsStar />}
          </span>
        ))}
      </div>
    </div>
  );
}

export default RatingStars;