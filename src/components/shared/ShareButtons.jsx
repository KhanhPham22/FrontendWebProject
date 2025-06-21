import { Button } from 'react-bootstrap';
import { BsTwitter, BsFacebook, BsLink } from 'react-icons/bs';

function ShareButtons({ recipe }) {
  const shareUrl = `${window.location.origin}/recipe/${recipe.id}`;
  const title = encodeURIComponent(recipe.title);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="d-flex mb-3">
      <Button
        variant="outline-primary"
        href={`https://twitter.com/intent/tweet?text=${title}&url=${shareUrl}`}
        target="_blank"
        className="me-2"
      >
        <BsTwitter /> Share on Twitter
      </Button>
      <Button
        variant="outline-primary"
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        className="me-2"
      >
        <BsFacebook /> Share on Facebook
      </Button>
      <Button variant="outline-secondary" onClick={copyLink}>
        <BsLink /> Copy Link
      </Button>
    </div>
  );
}

export default ShareButtons;