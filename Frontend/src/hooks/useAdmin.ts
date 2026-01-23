import { useState } from "react";
import toast from "react-hot-toast";
import type { User, UserRole, ApiError } from "../types";

const useAdmin = () => {
  const [loading, setLoading] = useState(false);

  const getAllUsers = async (): Promise<User[]> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data: User[] & ApiError = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (
    userId: string,
    role: UserRole
  ): Promise<User | null> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data: User & ApiError = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
      toast.success(`User role updated to ${role}`);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      const data: { message?: string } & ApiError = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("User deleted successfully");
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, getAllUsers, updateUserRole, deleteUser };
};

export default useAdmin;
