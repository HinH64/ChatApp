import { Link } from "react-router-dom";
import type { User } from "../../types";
import Avatar from "../ui/Avatar";

interface UserInfoProps {
  userData: User;
  isOnline: boolean | string;
  linkToProfile?: boolean;
}

const UserInfo = ({ userData, isOnline, linkToProfile = false }: UserInfoProps) => {
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
        {userData.bio && (
          <p className="text-xs text-base-content/60 truncate">{userData.bio}</p>
        )}
      </div>
    </>
  );

  if (linkToProfile) {
    return (
      <Link
        to="/profile"
        className="flex items-center gap-2 flex-1 min-w-0 hover:bg-base-200 rounded-lg p-1 -m-1 transition-colors"
      >
        {content}
      </Link>
    );
  }

  return <div className="flex items-center gap-2 flex-1 min-w-0">{content}</div>;
};

export default UserInfo;
