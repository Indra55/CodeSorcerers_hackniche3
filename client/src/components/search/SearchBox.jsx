// components/search/SearchBox.jsx
import { useState, useEffect } from "react";
import SearchSuggestions from "./SearchSuggestions";
import VisualSearchButton from "./VisualSearch";

const SearchBox = ({ variant }) => {
  // State
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced API call for suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/suggestions?term=${query}`);
          const data = await res.json();
          setSuggestions(data);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
        }
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Log search event
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "search", query }),
    });
    // Redirect to results page
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  // Variant-specific styles
  const containerStyles =
    variant === "hero"
      ? "w-full shadow-xl rounded-full bg-opacity-10 backdrop-blur-sm"
      : "w-full max-w-2xl rounded-lg bg-blue";

  const inputStyles =
    variant === "hero"
      ? "bg-transparent text-white placeholder:text-gray-200"
      : "text-gray-900 placeholder:text-gray-500";

  return (
    <form onSubmit={handleSearch} className={`relative ${containerStyles}`}>
      <div className="search-input-wrapper flex items-center gap-3 p-3 rounded-xl">
        {/* Text Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
          className={`flex-1 px-4 py-2 rounded-xl outline-none ${inputStyles}`}
        />

        {/* Visual Search Button (Bonus) */}
        {variant !== "hero" && <VisualSearchButton />}

        {/* Search Button */}
        <button
          type="submit"
          aria-label="Submit search"
          className="p-2 text-gray-600 hover:text-blue-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {query.length > 0 && (
        <SearchSuggestions
          suggestions={suggestions}
          isLoading={isLoading}
          onSuggestionClick={(suggestion) => {
            setQuery(suggestion);
            handleSearch(new Event("submit")); // Simulate form submit
          }}
        />
      )}
    </form>
  );
};

export default SearchBox;
