import { Card, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ProfileEditForm from '../components/profile/ProfileEditForm';
import RecipeImageItem from '../components/recipe/RecipeImageItem';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useState, useEffect } from 'react';
import { fetchRecipes } from '../services/api';
import './ProfilePage.css';

function ProfilePage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [commentsPosted, setCommentsPosted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserActivity = async () => {
      try {
        setLoading(true);
        const recipes = await fetchRecipes();
        // Lọc các recipe do người dùng tạo
        const userRecipes = recipes.filter(
          (recipe) => recipe.username === user?.username
        );
        setCreatedRecipes(userRecipes);

        // Lọc các recipe yêu thích dựa trên favorites trong localStorage
        const favRecipes = recipes.filter((recipe) =>
          favorites.includes(recipe.id)
        );
        setFavoriteRecipes(favRecipes);

        // Tính tổng số comment đã post
        const totalComments = recipes.reduce((acc, recipe) => {
          return (
            acc +
            (recipe.comments?.filter((c) => c.username === user?.username)
              .length || 0)
          );
        }, 0);
        setCommentsPosted(totalComments);
      } catch (error) {
        console.error('Error loading user activity:', error);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    if (user) loadUserActivity();
  }, [user, favorites]);

  if (!user) return (
    <div>
      <Navbar />
      <div className="text-center mt-4">Please login to view your profile.</div>
    </div>
  );
  if (loading) return (
    <div>
      <Navbar />
      <div className="text-center mt-4">Loading profile...</div>
    </div>
  );
  if (error) return (
    <div>
      <Navbar />
      <div className="text-center mt-4 text-danger">{error}</div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="profile-page mt-4">
        <h2>Profile</h2>
        <Row>
          {/* Thông tin người dùng */}
          <Col md={4}>
            <Card className="user-info-card">
              <Card.Body>
                <div className="text-center">
                  {user.profilePicture && (
                    <Image
                      src={user.profilePicture}
                      alt="Profile"
                      roundedCircle
                      className="profile-picture mb-3"
                      onError={(e) => (e.target.src = '/images/placeholder.jpg')}
                    />
                  )}
                  <Card.Title>{user.username}</Card.Title>
                </div>
                <Card.Text>Email: {user.email}</Card.Text>
                <Card.Text>Favorite Recipes: {favoriteRecipes.length}</Card.Text>
                <Card.Text>Created Recipes: {createdRecipes.length}</Card.Text>
                <Card.Text>Comments Posted: {commentsPosted}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          {/* Form chỉnh sửa profile */}
          <Col md={8}>
            <ProfileEditForm />
          </Col>
        </Row>
        {/* Danh sách recipe đã tạo */}
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Created Recipes</Card.Title>
                {createdRecipes.length > 0 ? (
                  <Row xs={1} md={2} lg={3} className="g-4">
                    {createdRecipes.map((recipe) => (
                      <Col key={recipe.id}>
                        <RecipeImageItem recipe={recipe} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p>No recipes created yet.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* Danh sách recipe yêu thích */}
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Favorite Recipes</Card.Title>
                {favoriteRecipes.length > 0 ? (
                  <Row xs={1} md={2} lg={3} className="g-4">
                    {favoriteRecipes.map((recipe) => (
                      <Col key={recipe.id}>
                        <RecipeImageItem recipe={recipe} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p>No favorite recipes yet.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ProfilePage;