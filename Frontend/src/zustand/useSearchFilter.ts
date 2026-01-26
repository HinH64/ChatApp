import { create } from "zustand";

interface SearchFilterState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const useSearchFilter = create<SearchFilterState>((set) => ({
  searchQuery: "",
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
}));

export default useSearchFilter;
