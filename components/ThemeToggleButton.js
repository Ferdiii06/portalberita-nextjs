
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
    >
      {theme === 'light' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

export default ThemeToggleButton;
