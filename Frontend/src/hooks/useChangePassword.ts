import { useState } from "react";
import toast from "react-hot-toast";
import type { ApiError, ChangePasswordInputs } from "../types";

const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const changePassword = async (inputs: ChangePasswordInputs): Promise<boolean> => {
    // Validate inputs
    if (!inputs.currentPassword || !inputs.newPassword || !inputs.confirmNewPassword) {
      toast.error("Please fill in all fields");
      return false;
    }

    if (inputs.newPassword !== inputs.confirmNewPassword) {
      toast.error("New passwords don't match");
      return false;
    }

    if (inputs.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return false;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      const data: { message?: string } & ApiError = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      toast.success(data.message || "Password changed successfully");
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

  return { loading, changePassword };
};

export default useChangePassword;
