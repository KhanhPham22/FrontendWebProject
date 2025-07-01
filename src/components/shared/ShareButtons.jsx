import { Button, Toast } from 'react-bootstrap';
import { useState } from 'react';

function ShareButtons({ recipe }) {
  const [showToast, setShowToast] = useState(false);
  const recipeUrl = `${window.location.origin}/recipe/${recipe.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(recipeUrl).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    });
  };

  return (
    <div className="mt-3">
      <Button
        variant="outline-primary"
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(recipeUrl)}&text=${encodeURIComponent(recipe.title)}`}
        target="_blank"
        className="me-2"
      >
        Share on Twitter
      </Button>
      <Button
        variant="outline-primary"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeUrl)}`}
        target="_blank"
        className="me-2"
      >
        Share on Facebook
      </Button>
      <Button variant="outline-secondary" onClick={copyToClipboard}>
        Copy Link
      </Button>
      <Toast show={showToast} onClose={() => setShowToast(false)} delay={2000} autohide>
        <Toast.Body>Link copied to clipboard!</Toast.Body>
      </Toast>
    </div>
  );
}

export default ShareButtons;