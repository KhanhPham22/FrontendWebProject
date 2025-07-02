import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique IDs

const RECIPES_KEY = 'recipes';

export const fetchRecipes = async () => {
  try {
    const recipes = JSON.parse(localStorage.getItem(RECIPES_KEY) || '[]');
    return recipes;
  } catch (error) {
    console.error('Error fetching recipes from localStorage:', error);
    throw error;
  }
};

export const postRecipe = async (recipe, imageFile) => {
  try {
    const recipes = JSON.parse(localStorage.getItem(RECIPES_KEY) || '[]');
    const newRecipe = {
      ...recipe,
      id: uuidv4(), // Generate unique ID
      image: imageFile ? `/assets/images/${imageFile.name}` : recipe.image || '/assets/images/placeholder.jpg'
    };
    recipes.push(newRecipe);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    return newRecipe;
  } catch (error) {
    console.error('Error saving recipe to localStorage:', error);
    throw error;
  }
};

export const updateRecipe = async (id, updates, imageFile) => {
  try {
    if (!id) throw new Error('Recipe ID is missing');
    const recipes = JSON.parse(localStorage.getItem(RECIPES_KEY) || '[]');
    const updatedRecipe = {
      ...updates,
      id,
      image: imageFile ? `/assets/images/${imageFile.name}` : updates.image || '/assets/images/placeholder.jpg'
    };
    const updatedRecipes = recipes.map((recipe) =>
      recipe.id === id ? updatedRecipe : recipe
    );
    localStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes));
    return updatedRecipe;
  } catch (error) {
    console.error('Error updating recipe in localStorage:', error);
    throw error;
  }
};

export const deleteRecipe = async (id) => {
  try {
    const recipes = JSON.parse(localStorage.getItem(RECIPES_KEY) || '[]');
    const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes));
  } catch (error) {
    console.error('Error deleting recipe from localStorage:', error);
    throw error;
  }
};

export const postComment = async (recipeId, comment) => {
  try {
    const recipes = JSON.parse(localStorage.getItem(RECIPES_KEY) || '[]');
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) throw new Error('Recipe not found');
    const updatedComments = [...(recipe.comments || []), comment];
    const updatedRecipe = { ...recipe, comments: updatedComments };
    const updatedRecipes = recipes.map((r) =>
      r.id === recipeId ? updatedRecipe : r
    );
    localStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes));
    return comment;
  } catch (error) {
    console.error('Error posting comment to localStorage:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = { ...userData, id: uuidv4() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  } catch (error) {
    console.error('Error registering user in localStorage:', error);
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error('User not found');
    if (user.password !== password) throw new Error('Invalid password');
    return user;
  } catch (error) {
    console.error('Error logging in user from localStorage:', error);
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUser = { ...users.find((u) => u.id === id), ...updates };
    const updatedUsers = users.map((u) => (u.id === id ? updatedUser : u));
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return updatedUser;
  } catch (error) {
    console.error('Error updating user in localStorage:', error);
    throw error;
  }
};