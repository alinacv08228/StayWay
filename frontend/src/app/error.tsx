"use client";

import { useEffect } from "react";

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
        <main className="error-page error-page-ready">
            <section className="error-section">

                <div className="error-card">

                    <div className="error-icon">
                        ✦
                    </div>

                    <p className="error-code">
                        ERROR 500
                    </p>

                    <h1
                        style={{
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Something went wrong
                    </h1>

                    <p className="error-message">
                        An unexpected error occurred.
                        Please try again.
                    </p>

                    <div className="error-actions">
                        <button
                            type="button"
                            className="error-reset-button"
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