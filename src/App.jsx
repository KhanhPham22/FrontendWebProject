import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor } from '@dnd-kit/core';
import { AuthProvider } from './context/AuthContext';
import { DragProvider } from './context/DragContext';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import MealPlannerPage from './pages/MealPlannerPage';
import RecipeManagementPage from './pages/RecipeManagementPage';

function App() {
  return (
    <AuthProvider>
      <DragProvider>
        <DndContext
          collisionDetection={closestCenter}
          sensors={[{ sensor: PointerSensor, options: { activationConstraint: { distance: 10 } } }]}
        >
          <Router>
            <div className="container">
              <Routes>
                <Route
                  path="/"
                  element={
                    <ErrorBoundary>
                      <HomePage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <ErrorBoundary>
                      <LoginPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <ErrorBoundary>
                      <RegisterPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ErrorBoundary>
                      <ProfilePage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/recipe/:id"
                  element={
                    <ErrorBoundary>
                      <RecipeDetailPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/meal-planner"
                  element={
                    <ErrorBoundary>
                      <MealPlannerPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/recipemanagement"
                  element={
                    <ErrorBoundary>
                      <RecipeManagementPage />
                    </ErrorBoundary>
                  }
                />
              </Routes>
            </div>
          </Router>
        </DndContext>
      </DragProvider>
    </AuthProvider>
  );
}

export default App;