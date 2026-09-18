import api from "../lib/api";
import { User } from "../types/types";

const SESSION_KEY = "stayway_current_user";
const TOKEN_KEY = "stayway_auth_token";
const TOKEN_EXPIRATION_KEY = "stayway_auth_expires_at";

type AuthResponse = {
    token: string;
    expiresAt: string;
    user: User;
};

export async function login(
    email: string,
    password: string
): Promise<User | null> {
    try {
        const response =
            await api.post<AuthResponse>(
                "/api/Users/login",
                {
                    email:
                        email
                            .trim()
                            .toLowerCase(),
                    password,
                }
            );

        const {
            token,
            expiresAt,
            user,
        } = response.data;

        if (
            typeof window !== "undefined"
        ) {
            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(user)
            );

            localStorage.setItem(
                TOKEN_KEY,
                token
            );

            localStorage.setItem(
                TOKEN_EXPIRATION_KEY,
                expiresAt
            );
        }

        return user;
    } catch {
        return null;
    }
}

export async function register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
): Promise<User | null> {
    try {
        const response =
            await api.post<User>(
                "/api/Users/register",
                {
                    firstName:
                        firstName.trim(),

                    lastName:
                        lastName.trim(),

                    email:
                        email
                            .trim()
                            .toLowerCase(),

                    password,
                }
            );

        return response.data;
    } catch {
        return null;
    }
}

export function logout(): void {
    if (
        typeof window === "undefined"
    ) {
        return;
    }

    localStorage.removeItem(
        SESSION_KEY
    );

    localStorage.removeItem(
        TOKEN_KEY
    );

    localStorage.removeItem(
        TOKEN_EXPIRATION_KEY
    );
}

export function getAuthToken():
    string | null {
    if (
        typeof window === "undefined"
    ) {
        return null;
    }

    const token =
        localStorage.getItem(
            TOKEN_KEY
        );

    const expiresAt =
        localStorage.getItem(
            TOKEN_EXPIRATION_KEY
        );

    if (!token || !expiresAt) {
        return null;
    }

    const expirationTime =
        new Date(
            expiresAt
        ).getTime();

    if (
        Number.isNaN(
            expirationTime
        ) ||
        expirationTime <= Date.now()
    ) {
        logout();
        return null;
    }

    return token;
}

export function getCurrentUser():
    User | null {
    if (
        typeof window === "undefined"
    ) {
        return null;
    }

    const token =
        getAuthToken();

    if (!token) {
        logout();
        return null;
    }

    const savedUser =
        localStorage.getItem(
            SESSION_KEY
        );

    if (!savedUser) {
        logout();
        return null;
    }

    try {
        return JSON.parse(
            savedUser
        ) as User;
    } catch {
        logout();
        return null;
    }
}

export function isAuthenticated():
    boolean {
    return (
        getAuthToken() !== null &&
        getCurrentUser() !== null
    );
}

export function hasRole(
    role: User["role"]
): boolean {
    const user =
        getCurrentUser();

    return user?.role === role;
}