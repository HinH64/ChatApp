import { FiMessageCircle, FiShield } from "react-icons/fi";
import { FaGamepad } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import useRightPanel from "../../zustand/useRightPanel";
import useConversation from "../../zustand/useConversation";
import type { RightPanelView } from "../../types";

const NavBar = () => {
  const { authUser } = useAuthContext();
  const { currentView, setCurrentView } = useRightPanel();
  const { setSelectedConversation } = useConversation();

  const handleNavClick = (view: RightPanelView) => {
    if (view !== "chat") {
      setSelectedConversation(null);
    }
    setCurrentView(view);
  };

  return (
    <div className="w-16 bg-base-300 flex flex-col items-center py-4 gap-2 border-r border-base-200 flex-shrink-0">
      {/* Chat */}
      <NavItem
        icon={<FiMessageCircle className="w-6 h-6" />}
        label="Chat"
        isActive={currentView === "chat"}
        onClick={() => handleNavClick("chat")}
      />

      {/* Game */}
      <NavItem
        icon={<FaGamepad className="w-6 h-6" />}
        label="Game"
        isActive={currentView === "game"}
        onClick={() => handleNavClick("game")}
      />

      {/* Admin - only show for admin users */}
      {authUser?.role === "admin" && (
        <NavItem
          icon={<FiShield className="w-6 h-6" />}
          label="Admin"
          isActive={currentView === "admin"}
          onClick={() => handleNavClick("admin")}
        />
      )}
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-12 h-12 flex flex-col items-center justify-center rounded-xl transition-all duration-200 group ${
        isActive
          ? "bg-primary text-primary-content"
          : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
      }`}
      title={label}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-content rounded-r-full" />
      )}
      {icon}
      <span className="text-[10px] mt-0.5 font-medium">{label}</span>
    </button>
  );
};

export default NavBar;
