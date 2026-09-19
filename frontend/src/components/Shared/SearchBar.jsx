import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/useDebounce";

const SearchBar = ({ onSearch, placeholder = "Buscar...", className = "" }) => {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);

    // Emite el valor debounced al componente padre
    useEffect(() => {
        onSearch(debouncedQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery]);

    return (
        <input
            type="text"
            className={className}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
};

export default SearchBar;