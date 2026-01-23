import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import type { User, ApiError } from "../types";

const useUploadAvatar = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const uploadAvatar = async (file: File): Promise<User | null> => {
    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return null;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return null;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/users/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data: User & ApiError = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Update auth context and localStorage
      setAuthUser(data);
      localStorage.setItem("chat-user", JSON.stringify(data));
      toast.success("Avatar updated successfully");
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

  const resetAvatar = async (): Promise<User | null> => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/profile/avatar", {
        method: "DELETE",
      });

      const data: User & ApiError = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Update auth context and localStorage
      setAuthUser(data);
      localStorage.setItem("chat-user", JSON.stringify(data));
      toast.success("Avatar reset to default");
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

  return { loading, uploadAvatar, resetAvatar };
};

export default useUploadAvatar;
