import { Card } from 'react-bootstrap';

function CommentList({ comments }) {
  return (
    <div className="mt-4">
      <h5>Comments</h5>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment, index) => (
          <Card key={index} className="mb-2">
            <Card.Body>
              <Card.Title>{comment.username}</Card.Title>
              <Card.Text>{comment.text}</Card.Text>
              <Card.Footer className="text-muted">
                {new Date(comment.timestamp).toLocaleString()}
              </Card.Footer>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default CommentList;