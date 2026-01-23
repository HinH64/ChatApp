import { useState } from "react";
import toast from "react-hot-toast";
import type { User, ApiError } from "../types";

const useGetProfile = () => {
  const [loading, setLoading] = useState(false);

  const getMyProfile = async (): Promise<User | null> => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile");
      const data: User & ApiError = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
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

  const getUserProfile = async (userId: string): Promise<User | null> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`);
      const data: User & ApiError = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
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

  return { loading, getMyProfile, getUserProfile };
};

export default useGetProfile;
