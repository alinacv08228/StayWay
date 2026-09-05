import { users } from "../data/mockData";
import { User } from "../types/types";

const SESSION_KEY = "stayway_current_user";

export function login(
    email: string,
    password: string
): User | null {
    const user = users.find(
        (item) =>
            item.email === email &&
            password === "123456"
    );

    if (!user) {
        return null;
    }

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
    );

    return user;
}

export function logout(): void {
    localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
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