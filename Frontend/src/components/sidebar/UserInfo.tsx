import type { User } from "../../types";
import Avatar from "../ui/Avatar";

interface UserInfoProps {
  userData: User;
  isOnline: boolean | string;
  onClick?: () => void;
}

const UserInfo = ({ userData, isOnline, onClick }: UserInfoProps) => {
  const content = (
    <>
      <Avatar
        src={userData.profilePic}
        alt={userData.fullName}
        size="lg"
        showOnlineStatus={!!isOnline}
        isOnline={!!isOnline}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <p className="font-bold truncate">{userData.fullName}</p>
        {userData.bio ? (
          <p className="text-xs text-base-content/60 truncate">{userData.bio}</p>
        ) : (
          <p className="text-xs text-base-content/40 truncate">@{userData.username}</p>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 flex-1 min-w-0 hover:bg-base-200 rounded-lg p-1 -m-1 transition-colors text-left"
      >
        {content}
      </button>
    );
  }

  return <div className="flex items-center gap-2 flex-1 min-w-0">{content}</div>;
};

export default UserInfo;
