// components/search/SearchBox.jsx
import { useState, useEffect } from "react";
import SearchSuggestions from "./SearchSuggestions";
import VisualSearchButton from "./VisualSearch";

// Check for Web Speech API support
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const SearchBox = ({ variant }) => {
  // State
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false); // For STT status

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

  // STT: Start and Stop Listening
  const startListening = () => {
    if (!SpeechRecognition) {
      console.error("Web Speech API not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) =>
      console.error("Speech recognition error:", event.error);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };

    recognition.start();
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

        {/* STT Button */}
        <button
          type="button"
          onClick={startListening}
          className={`p-2 ${isListening ? "text-red-600" : "text-gray-600"} hover:text-blue-600`}
          aria-label="Start voice search"
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
              d="M12 1.5a3.75 3.75 0 0 1 3.75 3.75v6a3.75 3.75 0 0 1-7.5 0v-6A3.75 3.75 0 0 1 12 1.5Zm7.5 9.75v.75a7.5 7.5 0 0 1-15 0v-.75m7.5 7.5v3m-3 0h6"
            />
          </svg>
        </button>

        {/* Visual Search Button */}
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
