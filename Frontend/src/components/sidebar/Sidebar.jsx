import SearchInput from "./SearchInput"
import ConversationList from "./ConversationList"
import LogoutButton from "./LogoutButton"
import { useAuthContext } from '../../context/AuthContext';
import UserInfo from "./UserInfo";
import { useState } from 'react';
import { IoMdMenu } from "react-icons/io";

const Sidebar = () => {
	const {authUser} = useAuthContext();
	const [isOpen, setIsOpen] = useState(false);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

  return (
    <>
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-circle"
        onClick={toggleSidebar}
      >
        <IoMdMenu size={24} />
      </button>
      <div className={`lg:w-1/4 w-full fixed lg:static top-0 left-0 z-40 bg-base-100 h-full transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className='border-r bg-base-100 p-4 flex flex-col h-full'>
          <div className='flex gap-2 items-center rounded p-2 py-1'>
            <UserInfo userData={authUser} isOnline={false} />
            <LogoutButton />
          </div>
          <div className='divider px-3'></div>
          <SearchInput />
          <div className='divider px-3'></div>
          <ConversationList />
        </div>
      </div>
    </>
  )
}

export default Sidebar