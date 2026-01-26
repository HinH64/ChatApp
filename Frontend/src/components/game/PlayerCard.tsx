import type { GamePlayer, User } from "../../types";
import { FaCrown, FaWifi } from "react-icons/fa";
import { MdSignalWifiOff } from "react-icons/md";
import Avatar from "../ui/Avatar";

interface PlayerCardProps {
  player: GamePlayer;
  isHost: boolean;
}

const PlayerCard = ({ player, isHost }: PlayerCardProps) => {
  const user = player.user as User;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg bg-base-200 ${
        !player.isConnected ? "opacity-50" : ""
      }`}
    >
      <Avatar
        src={user.profilePic}
        alt={user.fullName}
        size="md"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{user.fullName}</span>
          {isHost && (
            <FaCrown className="text-yellow-500" title="Host" />
          )}
        </div>
        <span className="text-sm text-base-content/60">@{user.username}</span>
      </div>
      <div>
        {player.isConnected ? (
          <FaWifi className="text-success" title="Connected" />
        ) : (
          <MdSignalWifiOff className="text-error" title="Disconnected" />
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
