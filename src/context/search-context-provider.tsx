"use client";

import { createContext, useContext, useState } from "react";

type SearchContextType = {
  searchQuery: string;
  handleSearchQuery: (str: string) => void;
};
const SearchContext = createContext<SearchContextType | null>(null);

export default function SearchContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // event handlers
  const handleSearchQuery = (str: string) => {
    setSearchQuery(str);
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        handleSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context || context === undefined) {
    throw new Error(
      "useSearchContext must be used within a PetContextProvider"
    );
  }
  return context;
};
