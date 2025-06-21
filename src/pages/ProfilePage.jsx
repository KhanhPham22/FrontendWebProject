import { Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useState, useEffect } from 'react';
import { fetchRecipes } from '../services/api';

function ProfilePage() {
  const { user } = useAuth();
  const [favorites] = useLocalStorage('favorites', []);
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [commentsPosted, setCommentsPosted] = useState(0);

  useEffect(() => {
    const loadUserActivity = async () => {
      const recipes = await fetchRecipes();
      const userRecipes = recipes.filter((recipe) => recipe.username === user?.username);
      setCreatedRecipes(userRecipes);

      const totalComments = recipes.reduce((acc, recipe) => {
        return acc + (recipe.comments?.filter((c) => c.username === user?.username).length || 0);
      }, 0);
      setCommentsPosted(totalComments);
    };
    if (user) loadUserActivity();
  }, [user]);

  if (!user) return <div>Please login to view your profile.</div>;

  return (
    <div className="mt-4">
      <h2>Profile</h2>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>{user.username}</Card.Title>
              {user.profilePicture && (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{ width: '100px', height: '100px' }}
                />
              )}
              <Card.Text>Email: {user.email}</Card.Text>
              <Card.Text>Favorite Recipes: {favorites.length}</Card.Text>
              <Card.Text>Created Recipes: {createdRecipes.length}</Card.Text>
              <Card.Text>Comments Posted: {commentsPosted}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <ProfileEditForm />
        </Col>
      </Row>
    </div>
  );
}

export default ProfilePage;