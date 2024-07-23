import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) return;
		await sendMessage(message);
		setMessage("");
	};

  return (
    <form className='px-4 py-4 bg-base-100' onSubmit={handleSubmit}>
        <div className='w-full relative '>
          <div className='flex-1 overflow-auto items-center justify-center min-w-96 mx-96 min-h-5'>
            <input
                type='text'
                className=' input input-bordered rounded-lg block w-full p-2.5 '
                placeholder='Send a message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
                 {loading ? <div className='loading loading-spinner'></div> : <BsSend />}
            </button>
          </div>
        </div>
    </form>
  )
}

export default MessageInput