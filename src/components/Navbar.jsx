import { Link } from 'react-router-dom';
import ThemeToggle from './shared/ThemeToggle';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm mb-4" data-theme>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="text-success">Taste</span>Mate
        </Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/recipes">Recipes</Link>
          <Link className="nav-link" to="/community">Community</Link>
          <Link className="nav-link" to="/meal-planner">Meal Planner</Link>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar;