import api from "../lib/api";
import { User } from "../types/types";

const SESSION_KEY = "stayway_current_user";

export async function login(
    email: string,
    password: string
): Promise<User | null> {
    try {
        const response = await api.post<User>(
            "/api/Users/login",
            {
                email: email.trim().toLowerCase(),
                password,
            }
        );

        const user = response.data;

        if (typeof window !== "undefined") {
            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(user)
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
        const response = await api.post<User>(
            "/api/Users/register",
            {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                password,
            }
        );

        return response.data;
    } catch {
        return null;
    }
}

export function logout(): void {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
    if (typeof window === "undefined") {
        return null;
    }

    const savedUser =
        localStorage.getItem(SESSION_KEY);

    if (!savedUser) {
        return null;
    }

    try {
        return JSON.parse(savedUser) as User;
    } catch {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }
}

export function isAuthenticated(): boolean {
    return getCurrentUser() !== null;
}

export function hasRole(
    role: User["role"]
): boolean {
    const user = getCurrentUser();

    return user?.role === role;
}