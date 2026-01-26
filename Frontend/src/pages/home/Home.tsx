import Sidebar from "../../components/sidebar/Sidebar";
import RightPanel from "../../components/panels/RightPanel";

const Home = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <RightPanel />
    </div>
  );
};

export default Home;
