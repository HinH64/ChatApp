import useRightPanel from "../../zustand/useRightPanel";
import MessageContainer from "../messages/MessageContainer";
import GamePanel from "./GamePanel";
import AdminPanel from "./AdminPanel";

const RightPanel = () => {
  const { currentView } = useRightPanel();

  switch (currentView) {
    case "game":
      return <GamePanel />;
    case "admin":
      return <AdminPanel />;
    case "chat":
    default:
      return <MessageContainer />;
  }
};

export default RightPanel;
