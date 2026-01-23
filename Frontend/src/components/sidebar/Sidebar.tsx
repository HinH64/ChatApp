import SearchInput from "./SearchInput";
import ConversationList from "./ConversationList";
import LogoutButton from "./LogoutButton";
import { useAuthContext } from "../../context/AuthContext";
import UserInfo from "./UserInfo";
import ThemeToggle from "../ui/ThemeToggle";
import ProfileModal from "../profile/ProfileModal";
import { useState, useEffect } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { FiMessageCircle, FiShield } from "react-icons/fi";
import { FaGamepad } from "react-icons/fa";
import { Link } from "react-router-dom";
import useConversation from "../../zustand/useConversation";

const Sidebar = () => {
  const { authUser } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { selectedConversation } = useConversation();

  // Close sidebar when a conversation is selected (mobile only)
  useEffect(() => {
    if (selectedConversation && isOpen) {
      setIsOpen(false);
    }
  }, [selectedConversation]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-circle btn-ghost bg-base-100/90 backdrop-blur-sm shadow-lg border border-base-300"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <IoMdClose size={22} /> : <IoMdMenu size={22} />}
      </button>

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <div
        className={`w-80 lg:w-80 fixed lg:static top-0 left-0 z-40 bg-base-100 h-full transition-transform duration-300 ease-out shadow-2xl lg:shadow-none flex-shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full border-r border-base-200">
          {/* Header */}
          <div className="p-4 border-b border-base-200">
            {/* Logo and title */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md">
                  <FiMessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">ChatApp</h1>
                  <p className="text-xs text-base-content/50">Stay connected</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  to="/game"
                  className="btn btn-ghost btn-sm btn-circle"
                  title="Werewords Game"
                >
                  <FaGamepad className="w-5 h-5 text-secondary" />
                </Link>
                {authUser?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="btn btn-ghost btn-sm btn-circle"
                    title="Admin Panel"
                  >
                    <FiShield className="w-5 h-5 text-primary" />
                  </Link>
                )}
                <ThemeToggle />
              </div>
            </div>

            {/* User info card */}
            {authUser && (
              <div className="bg-base-200/50 rounded-xl p-3 flex items-center justify-between">
                <UserInfo
                  userData={authUser}
                  isOnline={false}
                  onClick={() => setIsProfileModalOpen(true)}
                />
                <LogoutButton />
              </div>
            )}
          </div>

          {/* Search */}
          <div className="p-4 border-b border-base-200">
            <SearchInput />
          </div>

          {/* Conversations header */}
          <div className="px-4 py-3">
            <h2 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider">
              Messages
            </h2>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-hidden">
            <ConversationList />
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
