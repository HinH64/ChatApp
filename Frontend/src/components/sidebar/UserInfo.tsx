import type { User } from "../../types";

interface UserInfoProps {
  userData: User;
  isOnline: boolean | string;
}

const UserInfo = ({ userData, isOnline }: UserInfoProps) => {
  return (
    <>
      <div className={`avatar ${isOnline ? "online" : ""}`}>
        <div className="w-12 rounded-full">
          <img src={userData.profilePic} alt="user avatar" />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-3 justify-between">
          <p className="font-bold">{userData.fullName}</p>
        </div>
      </div>
    </>
  );
};

export default UserInfo;
