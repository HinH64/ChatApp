import { useState } from "react";
import { FiUser } from "react-icons/fi";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

const sizeClasses = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
  "2xl": "w-32 h-32",
};

const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-12 h-12",
};

const textSizes = {
  xs: "text-xs",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
  "2xl": "text-3xl",
};

const onlineDotSizes = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-3.5 h-3.5",
  "2xl": "w-4 h-4",
};

const ringClasses = {
  xs: "ring-1",
  sm: "ring-2",
  md: "ring-2",
  lg: "ring-2",
  xl: "ring-2",
  "2xl": "ring-4",
};

const Avatar = ({
  src,
  alt = "User",
  size = "md",
  className = "",
  showOnlineStatus = false,
  isOnline = false,
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleLoad = () => {
    setImageLoading(false);
  };

  // Generate initials from alt text
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden ${ringClasses[size]} ring-base-100 bg-base-200 flex items-center justify-center`}
      >
        {/* Loading state */}
        {imageLoading && src && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-200">
            <span className="loading loading-spinner loading-xs"></span>
          </div>
        )}

        {/* Image */}
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover ${imageLoading ? "opacity-0" : "opacity-100"} transition-opacity`}
            onError={handleError}
            onLoad={handleLoad}
          />
        ) : (
          /* Fallback - Initials or Icon */
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            {alt && alt !== "User" ? (
              <span className={`text-base-content/70 font-semibold ${textSizes[size]}`}>
                {getInitials(alt)}
              </span>
            ) : (
              <FiUser className={`${iconSizes[size]} text-base-content/50`} />
            )}
          </div>
        )}
      </div>

      {/* Online status indicator */}
      {showOnlineStatus && isOnline && (
        <span
          className={`absolute bottom-0 right-0 ${onlineDotSizes[size]} bg-success rounded-full border-2 border-base-100`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;
