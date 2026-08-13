import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import axios from "axios";

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);
    const [result, setResult] = useState([]);

    useEffect(() => {
        if (!debouncedQuery) {
            setResult([]);
            return;
        }
        axios.get(`http://localhost:3000/api/user?search=${debouncedQuery}`)
            .then((res) => {
                setResult(res.data.map(user => user.email));
            })
            .catch(err => console.error(err));
    }, [debouncedQuery]);

    return (
        <div>
            <input
                type='text'
                placeholder='Buscar usuario...'
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            <ul>
                {result.map((r, i) => (
                    <li key={i}>
                        {r}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;
