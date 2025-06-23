import { Link } from "react-router-dom";
import ThemeToggle from "../components/shared/ThemeToggle";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth(); // Changed currentUser to user and added logout

  return (
    <nav className="navbar navbar-expand-lg bg-light shadow-sm mb-4" data-theme>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="text-success">Taste</span>Mate
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/favorites">Favorites</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/meal-planner">Meal Planner</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/recipe">RecipeDetail</Link>
            </li>
           
          </ul>
          
          <div className="d-flex align-items-center">
            {/* Always show Login and Register buttons */}
            <Link className="btn btn-outline-success me-2" to="/login">
              Login
            </Link>
            <Link className="btn btn-success me-2" to="/register">
              Register
            </Link>
            
            {/* Show user info/avatar and logout when logged in */}
            {user && (
              <>
                <Link 
                  className="btn btn-outline-primary me-2 d-flex align-items-center" 
                  to="/profile"
                  title={user.displayName || user.username || "Profile"}
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="rounded-circle me-1"
                      style={{ width: "30px", height: "30px", objectFit: "cover" }}
                    />
                  ) : (
                    <i className="bi bi-person-circle me-1"></i>
                  )}
                  <span className="d-none d-lg-inline">
                    {user.displayName || user.username || "Profile"}
                  </span>
                </Link>
                <button className="btn btn-outline-danger" onClick={logout}>
                  Logout
                </button>
              </>
            )}
            <ThemeToggle className="ms-3" />
          </div>
        </div>
        </div>
      
    </nav>
  );
}

export default Navbar;