import { useEffect, useRef, useState } from "react";
import { apiFetch } from "./fetchInstance";

interface User {
    id: string;
    name: string;
    email: string;
}

const STALE_TIME = 1000 * 60 * 5; // 5 mins

export const useUser = () => {
    const [data, setData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    const lastFetchedRef = useRef<number | null>(null);

    const fetchUser = async (retry = 1) => {
        setIsLoading(true);
        setIsError(false);

        try {
            const response = await apiFetch("/get-user");
            if (!response.ok) throw new Error("Failed to fetch user");
            const json = await response.json();
            setData(json);

            lastFetchedRef.current = Date.now();
        } catch (err) {
            if (retry > 0) {
                return fetchUser(retry - 1);
            }
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    // load on mount + use staleTime
    useEffect(() => {
        const now = Date.now();

        if (
            !lastFetchedRef.current ||
            now - lastFetchedRef.current > STALE_TIME
        ) {
            fetchUser(1); // retry 1 time
        }
    }, []);

    const refresh = () => fetchUser(1);

    return {
        data,
        isLoading,
        isError,
        refresh,
    };
};
