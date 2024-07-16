import {useEffect,useState} from 'react'
import toast from "react-hot-toast";

const useGetConversationList = () => {
    const [loading, setLoading] = useState(false);
    const [conversationList, setConversationList] = useState([]);

	useEffect(() => {
		const getConversationList = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/users");
				const data = await res.json();
				if (data.error) {
					throw new Error(data.error);
				}
				setConversationList(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversationList();
	}, []);

	return { loading, conversationList };
}

export default useGetConversationList