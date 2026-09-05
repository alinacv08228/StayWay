"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "../../services/authService";
import { useUser } from "../../context/UserContext";

export default function LoginPage() {
    const router = useRouter();

    const { setCurrentUser } = useUser();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [isLoading, setIsLoading] =
        useState(false);

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!password.trim()) {
            setError("Password is required.");
            return;
        }

        setIsLoading(true);

        const user = login(
            email.trim(),
            password
        );

        if (!user) {
            setError(
                "Invalid email or password."
            );
            setIsLoading(false);
            return;
        }

        setCurrentUser(user);

        if (user.role === "admin") {
            router.push("/admin");
        } else {
            router.push("/");
        }
    };

    return (
        <main className="login-page">
            <div className="login-card">

                <div className="login-header">
                    <span className="login-logo">
                        ✦
                    </span>

                    <h1>
                        Welcome to StayWay
                    </h1>

                    <p>
                        Sign in to continue
                    </p>
                </div>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="form-field">
                        <label htmlFor="login-email">
                            Email
                        </label>

                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="login-password">
                            Password
                        </label>

                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Signing in..."
                            : "Sign in"}
                    </button>
                </form>

                <div className="login-demo">
                    <strong>
                        Demo accounts
                    </strong>

                    <p>
                        User: alina@example.com
                    </p>

                    <p>
                        Admin: admin@stayway.com
                    </p>

                    <p>
                        Password: 123456
                    </p>
                </div>

            </div>
        </main>
    );
}