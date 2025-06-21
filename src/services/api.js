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

export const updateRecipe = async (id, recipe) => {
  try {
    const response = await axios.put(`${API_URL}/recipes/${id}`, recipe);
    return response.data;
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