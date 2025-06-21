import { useTheme } from '../../context/ThemeContext';
import { Button } from 'react-bootstrap';
import { BsSun, BsMoon } from 'react-icons/bs';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline-secondary"
      onClick={toggleTheme}
      className="d-flex align-items-center"
    >
      {theme === 'light' ? <BsMoon className="me-2" /> : <BsSun className="me-2" />}
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </Button>
  );
}

export default ThemeToggle;