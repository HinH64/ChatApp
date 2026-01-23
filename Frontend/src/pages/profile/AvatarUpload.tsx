import { useRef, useState, ChangeEvent } from "react";
import useUploadAvatar from "../../hooks/useUploadAvatar";
import type { User } from "../../types";
import { FiCamera, FiX, FiUser } from "react-icons/fi";

interface AvatarUploadProps {
  currentAvatar: string;
  fullName: string;
  onAvatarUpdate: (user: User) => void;
}

const AvatarUpload = ({ currentAvatar, fullName, onAvatarUpdate }: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loading, uploadAvatar, resetAvatar } = useUploadAvatar();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Get initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const updated = await uploadAvatar(file);
    if (updated) {
      onAvatarUpdate(updated);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleReset = async () => {
    const updated = await resetAvatar();
    if (updated) {
      onAvatarUpdate(updated);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const cancelPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayImage = preview || currentAvatar;
  const isLocalAvatar = currentAvatar.includes("/uploads/avatars/");

  return (
    <div className="relative">
      <div className="relative group">
        {!imageError || preview ? (
          <img
            src={displayImage}
            alt={fullName}
            className="w-32 h-32 rounded-full border-4 border-base-100 object-cover"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-base-100 bg-primary/10 flex items-center justify-center">
            {fullName ? (
              <span className="text-3xl font-semibold text-primary">
                {getInitials(fullName)}
              </span>
            ) : (
              <FiUser className="w-12 h-12 text-primary/60" />
            )}
          </div>
        )}

        {!preview && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            disabled={loading}
          >
            <FiCamera className="w-8 h-8 text-white" />
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

      {/* Preview actions */}
      {preview && (
        <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-2">
          <button
            type="button"
            onClick={handleUpload}
            className="btn btn-primary btn-xs"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Save"
            )}
          </button>
          <button
            type="button"
            onClick={cancelPreview}
            className="btn btn-ghost btn-xs"
            disabled={loading}
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Reset button (only show if user has custom avatar and no preview) */}
      {!preview && isLocalAvatar && (
        <button
          type="button"
          onClick={handleReset}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-base-content/60 hover:text-error"
          disabled={loading}
        >
          Reset to default
        </button>
      )}
    </div>
  );
};

export default AvatarUpload;
