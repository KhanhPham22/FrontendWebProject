import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { postComment } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function CommentForm({ recipeId }) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to comment');
      return;
    }
    if (comment.length > 500) {
      setError('Comment must be less than 500 characters');
      return;
    }
    try {
      await postComment(recipeId, {
        username: user.username,
        text: comment,
        timestamp: new Date().toISOString(),
      });
      setComment('');
    } catch (error) {
      setError('Failed to post comment');
    }
  };

  return (
    <div className="mt-4">
      <h5>Add Comment</h5>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default CommentForm;