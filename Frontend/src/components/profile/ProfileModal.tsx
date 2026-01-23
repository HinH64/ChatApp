import { useState, useEffect, FormEvent, useRef, ChangeEvent } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useGetProfile from "../../hooks/useGetProfile";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import useChangePassword from "../../hooks/useChangePassword";
import useUploadAvatar from "../../hooks/useUploadAvatar";
import type { User, UpdateProfileInputs, ChangePasswordInputs } from "../../types";
import Avatar from "../ui/Avatar";
import {
  FiX,
  FiUser,
  FiEdit2,
  FiShield,
  FiCamera,
  FiEye,
  FiEyeOff,
  FiCalendar,
  FiMail,
} from "react-icons/fi";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string; // If provided, view another user's profile
}

type TabType = "view" | "edit" | "security";

const ProfileModal = ({ isOpen, onClose, userId }: ProfileModalProps) => {
  const { authUser } = useAuthContext();
  const { loading: profileLoading, getMyProfile, getUserProfile } = useGetProfile();
  const { loading: updateLoading, updateProfile } = useUpdateProfile();
  const { loading: passwordLoading, changePassword } = useChangePassword();
  const { loading: avatarLoading, uploadAvatar, resetAvatar } = useUploadAvatar();

  const [profile, setProfile] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("view");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile = !userId || userId === authUser?._id;

  // Form states
  const [formData, setFormData] = useState<UpdateProfileInputs>({
    fullName: "",
    email: "",
    bio: "",
    gender: "male",
  });

  const [passwordData, setPasswordData] = useState<ChangePasswordInputs>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Fetch profile when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        let data: User | null = null;
        if (isOwnProfile) {
          data = await getMyProfile();
        } else if (userId) {
          data = await getUserProfile(userId);
        }
        if (data) {
          setProfile(data);
          setFormData({
            fullName: data.fullName,
            email: data.email || "",
            bio: data.bio || "",
            gender: data.gender,
          });
        }
      };
      fetchProfile();
      setActiveTab("view");
      setAvatarPreview(null);
    }
  }, [isOpen, userId, isOwnProfile]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Profile update handler
  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    const updated = await updateProfile(formData);
    if (updated) {
      setProfile(updated);
      setActiveTab("view");
    }
  };

  // Password change handler
  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    const success = await changePassword(passwordData);
    if (success) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setActiveTab("view");
    }
  };

  // Avatar handlers
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    const updated = await uploadAvatar(file);
    if (updated) {
      setProfile(updated);
      setAvatarPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAvatarReset = async () => {
    const updated = await resetAvatar();
    if (updated) {
      setProfile(updated);
    }
  };

  const cancelAvatarPreview = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isOpen) return null;

  const isLocalAvatar = profile?.profilePic?.includes("/uploads/avatars/");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with gradient */}
        <div className="relative h-24 bg-gradient-to-r from-primary via-secondary to-accent">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 btn btn-circle btn-sm btn-ghost bg-black/20 hover:bg-black/40 text-white border-0"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar section */}
        <div className="relative px-6 -mt-12">
          <div className="relative inline-block">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Preview"
                className="w-24 h-24 rounded-full border-4 border-base-100 object-cover shadow-lg"
              />
            ) : (
              <Avatar
                src={profile?.profilePic}
                alt={profile?.fullName || "User"}
                size="xl"
                className="shadow-lg [&>div]:border-4 [&>div]:border-base-100"
              />
            )}

            {/* Camera button for edit mode */}
            {isOwnProfile && activeTab === "edit" && !avatarPreview && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 btn btn-circle btn-xs btn-primary shadow-md"
                disabled={avatarLoading}
              >
                <FiCamera className="w-3 h-3" />
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Avatar preview actions */}
          {avatarPreview && (
            <div className="inline-flex gap-2 ml-4 align-bottom">
              <button
                onClick={handleAvatarUpload}
                className="btn btn-primary btn-xs"
                disabled={avatarLoading}
              >
                {avatarLoading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Save"
                )}
              </button>
              <button
                onClick={cancelAvatarPreview}
                className="btn btn-ghost btn-xs"
                disabled={avatarLoading}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Reset avatar button */}
          {isOwnProfile && activeTab === "edit" && !avatarPreview && isLocalAvatar && (
            <button
              onClick={handleAvatarReset}
              className="ml-4 text-xs text-base-content/50 hover:text-error transition-colors"
              disabled={avatarLoading}
            >
              Reset avatar
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 pt-4">
          {profileLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : !profile ? (
            <div className="text-center py-8 text-base-content/60">
              Profile not found
            </div>
          ) : (
            <>
              {/* User basic info (always visible) */}
              <div className="mb-4">
                <h2 className="text-xl font-bold">{profile.fullName}</h2>
                <p className="text-base-content/60">@{profile.username}</p>
              </div>

              {/* Tabs (only for own profile) */}
              {isOwnProfile && (
                <div className="flex gap-1 p-1 bg-base-200 rounded-xl mb-4">
                  <button
                    onClick={() => setActiveTab("view")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "view"
                        ? "bg-base-100 text-base-content shadow-sm"
                        : "text-base-content/60 hover:text-base-content"
                    }`}
                  >
                    <FiUser className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("edit")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "edit"
                        ? "bg-base-100 text-base-content shadow-sm"
                        : "text-base-content/60 hover:text-base-content"
                    }`}
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "security"
                        ? "bg-base-100 text-base-content shadow-sm"
                        : "text-base-content/60 hover:text-base-content"
                    }`}
                  >
                    <FiShield className="w-4 h-4" />
                    Security
                  </button>
                </div>
              )}

              {/* Tab content */}
              <div className="max-h-[40vh] overflow-y-auto">
                {/* View tab */}
                {activeTab === "view" && (
                  <div className="space-y-4">
                    {profile.bio && (
                      <p className="text-base-content/80">{profile.bio}</p>
                    )}

                    <div className="space-y-2">
                      {isOwnProfile && profile.email && (
                        <div className="flex items-center gap-3 text-sm">
                          <FiMail className="w-4 h-4 text-base-content/40" />
                          <span className="text-base-content/70">{profile.email}</span>
                        </div>
                      )}
                      {profile.createdAt && (
                        <div className="flex items-center gap-3 text-sm">
                          <FiCalendar className="w-4 h-4 text-base-content/40" />
                          <span className="text-base-content/70">
                            Joined {new Date(profile.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Edit tab */}
                {activeTab === "edit" && isOwnProfile && (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full mt-1"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        className="input input-bordered w-full mt-1"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Bio
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full mt-1"
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself..."
                        maxLength={150}
                        rows={3}
                      />
                      <div className="text-xs text-base-content/40 text-right">
                        {formData.bio?.length || 0}/150
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Gender
                      </label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            className="radio radio-primary radio-sm"
                            checked={formData.gender === "male"}
                            onChange={() =>
                              setFormData({ ...formData, gender: "male" })
                            }
                          />
                          <span className="text-sm">Male</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            className="radio radio-primary radio-sm"
                            checked={formData.gender === "female"}
                            onChange={() =>
                              setFormData({ ...formData, gender: "female" })
                            }
                          />
                          <span className="text-sm">Female</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={updateLoading}
                    >
                      {updateLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </form>
                )}

                {/* Security tab */}
                {activeTab === "security" && isOwnProfile && (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Current Password
                      </label>
                      <div className="relative mt-1">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          className="input input-bordered w-full pr-10"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/60"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              current: !showPasswords.current,
                            })
                          }
                        >
                          {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        New Password
                      </label>
                      <div className="relative mt-1">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          className="input input-bordered w-full pr-10"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/60"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              new: !showPasswords.new,
                            })
                          }
                        >
                          {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-base-content/70">
                        Confirm New Password
                      </label>
                      <div className="relative mt-1">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          className="input input-bordered w-full pr-10"
                          value={passwordData.confirmNewPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmNewPassword: e.target.value,
                            })
                          }
                          minLength={6}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/60"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                        >
                          {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
