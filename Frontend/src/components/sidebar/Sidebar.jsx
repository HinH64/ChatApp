import SearchInput from "./SearchInput"
import ConversationList from "./ConversationList"
import LogoutButton from "./LogoutButton"
import { useAuthContext } from '../../context/AuthContext';
import UserInfo from "./UserInfo";

const Sidebar = () => {
	const {authUser} = useAuthContext();
  return (
    <div className='border-r border-slate-500 p-4 flex flex-col'>
			<div className='flex gap-2 items-center rounded p-2 py-1 '>
			<UserInfo userData={authUser} isOnline={false} />
			</div>
			<div className='divider px-3'></div>
			<SearchInput />
			<div className='divider px-3'></div>
			<ConversationList />
			<LogoutButton />
		</div>
  )
}

export default Sidebar