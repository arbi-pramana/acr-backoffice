import { useEffect, useState } from "react";

export function useAppVersion() {
    const [version, setVersion] = useState<string | null>(null);

    useEffect(() => {
        fetch("/version.json")
            .then((res) => res.json())
            .then((data) => setVersion(data.version))
            .catch(() => setVersion("dev")); // fallback if fetch fails
    }, []);

    return version;
}
