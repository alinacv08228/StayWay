"use client";

import {
    useEffect,
    useState,
} from "react";

import { useAxios } from "../../context/AxiosContext";
import {
    getHealth,
    HealthResponse,
} from "../../services/healthService";

export default function ApiTestPage() {
    const api = useAxios();

    const [health, setHealth] =
        useState<HealthResponse | null>(null);

    const [error, setError] =
        useState("");

    useEffect(() => {
        async function testBackend() {
            try {
                const result =
                    await getHealth(api);

                setHealth(result);
            } catch {
                setError(
                    "Could not connect to StayWay API"
                );
            }
        }

        testBackend();
    }, [api]);

    return (
        <main
            style={{
                padding: "60px",
                fontFamily: "Arial",
            }}
        >
            <h1>StayWay API Test</h1>

            {health && (
                <>
                    <p>
                        Status:{" "}
                        <strong>
                            {health.status}
                        </strong>
                    </p>

                    <p>
                        Message:{" "}
                        <strong>
                            {health.message}
                        </strong>
                    </p>
                </>
            )}

            {error && (
                <p>{error}</p>
            )}
        </main>
    );
}