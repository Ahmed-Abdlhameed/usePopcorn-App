import { useState, useEffect } from "react";

export function useLocalStorage(initialValue, key) {
    const [value, setValue] = useState(function () {
        const localData = localStorage.getItem(key);
        return localData ? JSON.parse(localData) : initialValue;
    });

    useEffect(
        function () {
            localStorage.setItem("watched", JSON.stringify(value));
        }, [value, key]
    );

    return [value, setValue];
}