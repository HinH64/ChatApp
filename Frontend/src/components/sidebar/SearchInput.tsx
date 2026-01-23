import { IoSearchSharp } from "react-icons/io5";
import { useState, FormEvent } from "react";
import useConversation from "../../zustand/useConversation";
import useGetConversationList from "../../hooks/useGetConversationList";
import toast from "react-hot-toast";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { conversationList } = useGetConversationList();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }
    const conversation = conversationList.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else {
      toast.error("No such user found!");
    }
  };

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
          <IoSearchSharp className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Search conversations..."
          className="input input-bordered w-full pl-12 pr-4 h-11 bg-base-200/50 border-base-300 focus:border-primary focus:bg-base-100 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </form>
  );
};

export default SearchInput;
