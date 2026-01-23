import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiShield, FiTrash2, FiUser, FiUsers } from "react-icons/fi";
import useAdmin from "../../hooks/useAdmin";
import Avatar from "../../components/ui/Avatar";
import type { User, UserRole } from "../../types";

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { loading, getAllUsers, updateUserRole, deleteUser } = useAdmin();

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const updated = await updateUserRole(userId, newRole);
    if (updated) {
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, role: newRole } : user))
      );
    }
  };

  const handleDelete = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/"
          className="btn btn-ghost btn-circle"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FiUsers className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">User Management</h1>
            <p className="text-sm text-base-content/60">
              {users.length} users total
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="flex-1 overflow-auto rounded-xl bg-base-100 shadow-sm">
        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-base-content/60">
            <FiUsers className="w-12 h-12 mb-2" />
            <p>No users found</p>
          </div>
        ) : (
          <table className="table table-zebra">
            <thead className="bg-base-200">
              <tr>
                <th>User</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.profilePic}
                        alt={user.fullName}
                        size="sm"
                      />
                      <span className="font-medium">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="text-base-content/70">@{user.username}</td>
                  <td className="text-base-content/70">
                    {user.email || "-"}
                  </td>
                  <td>
                    <select
                      className="select select-sm select-bordered w-28"
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value as UserRole)
                      }
                      disabled={loading}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    {deleteConfirm === user._id ? (
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-error btn-xs"
                          onClick={() => handleDelete(user._id)}
                          disabled={loading}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => setDeleteConfirm(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => setDeleteConfirm(user._id)}
                        disabled={loading}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Role Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm text-base-content/60">
        <div className="flex items-center gap-2">
          <FiUser className="w-4 h-4" />
          <span>User - Regular chat access</span>
        </div>
        <div className="flex items-center gap-2">
          <FiShield className="w-4 h-4 text-primary" />
          <span>Admin - Full management access</span>
        </div>
      </div>
    </div>
  );
};

export default Admin;
