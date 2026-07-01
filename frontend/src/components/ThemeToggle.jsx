import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-none hover:bg-[var(--line)] transition-colors "
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-[var(--ink)]" />
      ) : (
        <Moon className="w-5 h-5 text-[var(--ink)]" />
      )}
    </button>
  );
};

export default ThemeToggle;
