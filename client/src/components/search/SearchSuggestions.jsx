const SearchSuggestions = ({ suggestions, isLoading, onSuggestionClick }) => {
    const SearchSuggestions = ({ suggestions, isLoading, onSuggestionClick }) => {
        return (
          <div className="suggestions-dropdown">
            {isLoading ? (
              <div className="loading">Loading...</div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="suggestion-item"
                >
                  {suggestion}
                </div>
              ))
            )}
            {!isLoading && suggestions.length === 0 && (
              <div className="no-results">No suggestions found</div>
            )}
          </div>
        );
      };
  };
  
  export default SearchSuggestions;