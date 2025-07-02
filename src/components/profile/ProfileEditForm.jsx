import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { updateUser } from '../../services/api';

function ProfileEditForm() {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || '',
    dietaryPreferences: Array.isArray(user?.dietaryPreferences) ? user.dietaryPreferences : [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePreferenceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedPreferences = checked
        ? [...prev.dietaryPreferences, value]
        : prev.dietaryPreferences.filter((pref) => pref !== value);
      return { ...prev, dietaryPreferences: updatedPreferences };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      alert('No user logged in or user ID missing. Please log in again.');
      return;
    }
    if (!formData.username || !formData.email) {
      alert('Username and email are required.');
      return;
    }
    try {
      const updatedUserData = {
        username: formData.username,
        email: formData.email,
        profilePicture: formData.profilePicture,
        dietaryPreferences: formData.dietaryPreferences,
      };
      console.log('Submitting updated user:', updatedUserData);
      const refreshedUser = await updateUser(user.id, updatedUserData);
      setUser({ ...user, ...refreshedUser });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: `${error.config?.url}`
      });
      alert(`Failed to update profile: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Card className="p-4">
      <h3>Edit Profile</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Profile Picture URL</Form.Label>
          <Form.Control
            type="text"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Dietary Preferences</Form.Label>
          {['Vegetarian', 'Gluten-Free', 'Low-Calorie'].map((pref) => (
            <Form.Check
              key={pref}
              type="checkbox"
              label={pref}
              value={pref}
              checked={formData.dietaryPreferences.includes(pref)}
              onChange={handlePreferenceChange}
            />
          ))}
        </Form.Group>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </Card>
  );
}

export default ProfileEditForm;