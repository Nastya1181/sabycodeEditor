import { useEffect } from "react";

export default function useLocalStorage(syncState, key) {
    useEffect(() => {
        if (syncState) {
            localStorage.setItem(key, value);
        }
    }, [syncState]);
}