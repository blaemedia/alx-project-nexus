"use client";

import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void; // rename from onSearchResults
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query); // call onSearch from props
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-full bg-white border border-gray-300 rounded-full shadow-sm overflow-hidden"
    >
      <input
        type="text"
        placeholder="Search products, categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none"
      />
      <button
        type="submit"
        className="px-4 flex items-center justify-center hover:bg-gray-100 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
