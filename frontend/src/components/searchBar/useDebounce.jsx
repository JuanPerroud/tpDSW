import { useEffect, useState } from "react";

export function useDebounce(value, delay = 500) {
    const [debounce, setDebounce] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounce(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]); //cada vez que el valor de debounce cambie, el useEffect se ejecutara, esto quiere decir que cada vez que escribamos algo, se espera 500ms para que se actualice el valor

    return debounce;


}