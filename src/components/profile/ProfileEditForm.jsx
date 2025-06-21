import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

function ProfileEditForm() {
  const { user, register } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || '',
    dietaryPreferences: user?.dietaryPreferences || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePreferenceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      dietaryPreferences: checked
        ? [...prev.dietaryPreferences, value]
        : prev.dietaryPreferences.filter((pref) => pref !== value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register({ ...user, ...formData });
    alert('Profile updated!');
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