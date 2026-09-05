"use client";

import { useEffect } from "react";
import ErrorPage from "../components/ErrorPage";

export default function GlobalError({
                                        error,
                                        reset,
                                    }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main>
            <section className="section">
                <div className="container">
                    <div className="no-stays">
                        <p className="admin-label">
                            ERROR 500
                        </p>

                        <h1 className="page-title">
                            Something went wrong
                        </h1>

                        <p className="admin-description">
                            An unexpected error occurred.
                        </p>

                        <button
                            type="button"
                            className="reset-filters-button"
                            onClick={() => reset()}
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}