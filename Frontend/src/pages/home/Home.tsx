import NavBar from "../../components/navigation/NavBar";
import Sidebar from "../../components/sidebar/Sidebar";
import RightPanel from "../../components/panels/RightPanel";

const Home = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <NavBar />
      <Sidebar />
      <RightPanel />
    </div>
  );
};

export default Home;
