import { IoSunny, IoMoon } from "react-icons/io5";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-sm btn-circle swap swap-rotate"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <IoSunny className="w-5 h-5" />
      ) : (
        <IoMoon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
