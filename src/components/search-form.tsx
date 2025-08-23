"use client";

import { useSearchContext } from "@/context/search-context-provider";

export default function SearchForm() {
  const { searchQuery, handleSearchQuery } = useSearchContext();

  return (
    <form className="w-full h-full">
      <input
        type="search"
        value={searchQuery}
        placeholder="Search pets"
        className="w-full h-full bg-white/20 rounded-md px-5 outline-none transition focus:bg-white/50 hover:bg-white/30 placeholder:text-white/50"
        onChange={e => handleSearchQuery(e.target.value)}
      />
    </form>
  );
}
