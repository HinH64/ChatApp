import { IoSearchSharp, IoCloseCircle } from "react-icons/io5";
import useSearchFilter from "../../zustand/useSearchFilter";

const SearchInput = () => {
  const { searchQuery, setSearchQuery } = useSearchFilter();

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40">
        <IoSearchSharp className="w-5 h-5" />
      </span>
      <input
        type="text"
        placeholder="Search..."
        className="input input-bordered w-full pl-12 pr-10 h-11 bg-base-200/50 border-base-300 focus:border-primary focus:bg-base-100 transition-all"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70 transition-colors"
        >
          <IoCloseCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
