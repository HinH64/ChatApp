import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="btn btn-ghost btn-sm btn-circle hover:bg-error/20 hover:text-error"
      aria-label="Logout"
    >
      {!loading ? (
        <BiLogOut className="w-5 h-5" />
      ) : (
        <span className="loading loading-spinner loading-sm"></span>
      )}
    </button>
  );
};

export default LogoutButton;
