import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const fetchRecipes = async () => {
  try {
    const response = await axios.get(`${API_URL}/recipes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

export const postRecipe = async (recipe) => {
  try {
    const response = await axios.post(`${API_URL}/recipes`, recipe);
    return response.data;
  } catch (error) {
    console.error('Error posting recipe:', error);
    throw error;
  }
};

export const updateRecipe = async (id, updates) => {
  try {
    // Fetch the current recipe
    const response = await axios.get(`${API_URL}/recipes/${id}`);
    const currentRecipe = response.data;

    // Merge the existing recipe with the new updates
    const updatedRecipe = { ...currentRecipe, ...updates };

    // Use PATCH to update only the changed fields
    const putResponse = await axios.patch(`${API_URL}/recipes/${id}`, updatedRecipe);
    return putResponse.data;
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

export const deleteRecipe = async (id) => {
  try {
    await axios.delete(`${API_URL}/recipes/${id}`);
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

export const postComment = async (recipeId, comment) => {
  try {
    const recipes = await fetchRecipes();
    const recipe = recipes.find((r) => r.id === parseInt(recipeId));
    if (!recipe) throw new Error('Recipe not found');
    const updatedComments = [...(recipe.comments || []), comment];
    await updateRecipe(recipeId, { ...recipe, comments: updatedComments });
    return comment;
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const response = await axios.get(`${API_URL}/users?email=${email}`);
    const user = response.data[0];
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    return user;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};