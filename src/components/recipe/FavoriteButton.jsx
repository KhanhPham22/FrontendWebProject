import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { useLocalStorage } from '../../hooks/useLocalStorage';

function FavoriteButton({ recipeId }) {
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const isFavorite = favorites.includes(recipeId);

  const toggleFavorite = () => {
    setFavorites((prev) =>
      isFavorite ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  return (
    <Button
      variant={isFavorite ? 'danger' : 'outline-danger'}
      onClick={toggleFavorite}
      className="d-flex align-items-center mb-2"
    >
      {isFavorite ? <BsHeartFill className="me-2" /> : <BsHeart className="me-2" />}
      {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
    </Button>
  );
}

export default FavoriteButton;