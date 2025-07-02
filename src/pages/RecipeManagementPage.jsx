import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button, Container, Modal } from 'react-bootstrap';
import RecipeForm from '../components/recipe/RecipeForm';
import RecipeList from '../components/recipe/RecipeList';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { fetchRecipes as getRecipes, deleteRecipe, updateRecipe, postRecipe } from '../services/api';
import './RecipeManagementPage.css';

function RecipeManagementPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useLocalStorage('recipes', []);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [editRecipe, setEditRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await getRecipes();
        setRecipes(response || []);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      }
    };
    fetchRecipes();
  }, [setRecipes]);

  const handleDelete = async (recipeId) => {
    try {
      await deleteRecipe(recipeId);
      setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
      setShowDeleteModal(false);
      setRecipeToDelete(null);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      alert('Failed to delete recipe');
    }
  };

  const confirmDelete = (recipe) => {
    setRecipeToDelete(recipe);
    setShowDeleteModal(true);
  };

  const handleRecipeAdded = async (newRecipe) => {
    try {
      const recipeWithUser = {
        ...newRecipe,
        username: user?.username || 'Anonymous',
        image: newRecipe.image || '/assets/images/placeholder.jpg'
      };
      const savedRecipe = await postRecipe(recipeWithUser, newRecipe.image instanceof File ? newRecipe.image : null);
      setRecipes((prevRecipes) => {
        if (!prevRecipes.some((recipe) => recipe.id === savedRecipe.id)) {
          return [...prevRecipes, savedRecipe];
        }
        return prevRecipes;
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add recipe:', error);
      alert('Failed to add recipe');
    }
  };

  const handleEdit = (recipe) => {
    console.log('handleEdit called with recipe:', recipe);
    setEditRecipe(recipe);
    setShowEditModal(true);
  };

  const handleRecipeUpdated = async (updatedRecipe) => {
    try {
      const recipeWithImage = {
        ...updatedRecipe,
        image: updatedRecipe.image || '/assets/images/placeholder.jpg'
      };
      const savedRecipe = await updateRecipe(recipeWithImage.id, recipeWithImage, updatedRecipe.image instanceof File ? updatedRecipe.image : null);
      setRecipes(
        recipes.map((recipe) =>
          recipe.id === recipeWithImage.id ? savedRecipe : recipe
        )
      );
      setShowEditModal(false);
      setEditRecipe(null);
    } catch (error) {
      console.error('Failed to update recipe:', error);
      alert('Failed to update recipe');
    }
  };

  return (
    <>
      <Navbar />
      <Container className="recipe-management-page py-5">
        <h1 className="mb-4 text-center">Manage Your Recipes</h1>
        {user ? (
          <>
            <Button
              variant="primary"
              className="mb-4"
              onClick={() => {
                setEditRecipe(null);
                setShowForm(!showForm);
              }}
            >
              {showForm ? 'Cancel' : 'Create New Recipe'}
            </Button>

            {showForm && (
              <RecipeForm
                onRecipeAdded={handleRecipeAdded}
                onRecipeUpdated={handleRecipeUpdated}
                editRecipe={editRecipe}
              />
            )}

            <RecipeList
              recipes={recipes}
              onDelete={confirmDelete}
              onEdit={handleEdit}
              showControls={true}
            />

            <Modal
              show={showEditModal}
              onHide={() => {
                setShowEditModal(false);
                setEditRecipe(null);
              }}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Recipe</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <RecipeForm
                  onRecipeAdded={handleRecipeAdded}
                  onRecipeUpdated={handleRecipeUpdated}
                  editRecipe={editRecipe}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditRecipe(null);
                  }}
                >
                  Cancel
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete "{recipeToDelete?.title}"?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(recipeToDelete?.id)}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        ) : (
          <p className="text-center">Please log in to manage recipes.</p>
        )}
      </Container>
    </>
  );
}

export default RecipeManagementPage;