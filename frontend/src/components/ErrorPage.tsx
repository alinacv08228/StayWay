"use client";

import Link from "next/link";

type ErrorPageProps = {
    code: "401" | "403" | "404" | "500";
    title: string;
    message: string;
};

export default function ErrorPage({
                                      code,
                                      title,
                                      message,
                                  }: ErrorPageProps) {
    return (
        <main className="error-page error-page-ready">
            <section className="error-section">
                <div className="error-card">

                    <div className="error-icon">
                        ✦
                    </div>

                    <p className="error-code">
                        ERROR {code}
                    </p>

                    <h1>
                        {title}
                    </h1>

                    <p className="error-message">
                        {message}
                    </p>

                    <div className="error-actions">
                        <Link
                            href="/"
                            className="error-home-button"
                        >
                            Back to home
                        </Link>

                        {code === "401" && (
                            <Link
                                href="/login"
                                className="error-secondary-button"
                            >
                                Log in
                            </Link>
                        )}
                    </div>

                </div>
            </section>
        </main>
    );
}