import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import useGetProfile from "../../hooks/useGetProfile";
import ProfileForm from "./ProfileForm";
import AvatarUpload from "./AvatarUpload";
import ChangePassword from "./ChangePassword";
import type { User } from "../../types";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import Avatar from "../../components/ui/Avatar";

const Profile = () => {
  const { id } = useParams<{ id?: string }>();
  const { authUser } = useAuthContext();
  const { loading, getMyProfile, getUserProfile } = useGetProfile();
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const isOwnProfile = !id || id === authUser?._id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (isOwnProfile) {
        const data = await getMyProfile();
        setProfile(data);
      } else if (id) {
        const data = await getUserProfile(id);
        setProfile(data);
      }
    };
    fetchProfile();
  }, [id, isOwnProfile]);

  const handleProfileUpdate = (updatedProfile: User) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg">Profile not found</p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <Link to="/" className="btn btn-ghost btn-sm mb-4 gap-2">
          <FiArrowLeft />
          Back to Chat
        </Link>

        <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary h-32 relative">
            {isOwnProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-4 right-4 btn btn-sm btn-ghost text-white"
              >
                <FiEdit2 /> Edit Profile
              </button>
            )}
          </div>

          {/* Avatar */}
          <div className="relative px-6">
            <div className="absolute -top-16">
              {isOwnProfile && isEditing ? (
                <AvatarUpload
                  currentAvatar={profile.profilePic}
                  fullName={profile.fullName}
                  onAvatarUpdate={(updatedUser) => setProfile(updatedUser)}
                />
              ) : (
                <Avatar
                  src={profile.profilePic}
                  alt={profile.fullName}
                  size="2xl"
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 px-6 pb-6">
            {isOwnProfile && isEditing ? (
              <ProfileForm
                profile={profile}
                onUpdate={handleProfileUpdate}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <>
                {/* Profile Info */}
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                    <p className="text-base-content/60">@{profile.username}</p>
                  </div>

                  {profile.bio && (
                    <p className="text-base-content/80">{profile.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-base-content/60">
                    {isOwnProfile && profile.email && (
                      <span>{profile.email}</span>
                    )}
                    {profile.createdAt && (
                      <span>
                        Joined {new Date(profile.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Password Change Section (own profile only) */}
                {isOwnProfile && (
                  <div className="mt-8 pt-6 border-t border-base-300">
                    {showPasswordForm ? (
                      <ChangePassword
                        onCancel={() => setShowPasswordForm(false)}
                        onSuccess={() => setShowPasswordForm(false)}
                      />
                    ) : (
                      <button
                        onClick={() => setShowPasswordForm(true)}
                        className="btn btn-outline btn-sm"
                      >
                        Change Password
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
