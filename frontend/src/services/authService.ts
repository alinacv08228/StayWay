import { users } from "../data/mockData";
import { User } from "../types/types";

const SESSION_KEY = "stayway_current_user";
const USERS_KEY = "stayway_registered_users";
const PASSWORDS_KEY = "stayway_user_passwords";

type StoredPassword = {
    userId: string;
    password: string;
};

function getRegisteredUsers(): User[] {
    if (typeof window === "undefined") {
        return users;
    }

    const stored = localStorage.getItem(USERS_KEY);

    if (!stored) {
        return users;
    }

    try {
        const registeredUsers = JSON.parse(stored);

        if (!Array.isArray(registeredUsers)) {
            return users;
        }

        return [
            ...users,
            ...(registeredUsers as User[]).filter(
                (registeredUser) =>
                    !users.some(
                        (user) => user.id === registeredUser.id
                    )
            ),
        ];
    } catch {
        return users;
    }
}

function saveRegisteredUser(user: User): void {
    if (typeof window === "undefined") {
        return;
    }

    const stored = localStorage.getItem(USERS_KEY);
    let registeredUsers: User[] = [];

    if (stored) {
        try {
            const parsed = JSON.parse(stored);

            if (Array.isArray(parsed)) {
                registeredUsers = parsed as User[];
            }
        } catch {
            registeredUsers = [];
        }
    }

    const withoutDuplicate = registeredUsers.filter(
        (item) => item.id !== user.id
    );

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify([...withoutDuplicate, user])
    );
}

function saveUserPassword(
    userId: string,
    password: string
): void {
    if (typeof window === "undefined") {
        return;
    }

    const stored = localStorage.getItem(PASSWORDS_KEY);
    let passwords: StoredPassword[] = [];

    if (stored) {
        try {
            const parsed = JSON.parse(stored);

            if (Array.isArray(parsed)) {
                passwords = parsed as StoredPassword[];
            }
        } catch {
            passwords = [];
        }
    }

    const withoutDuplicate = passwords.filter(
        (item) => item.userId !== userId
    );

    localStorage.setItem(
        PASSWORDS_KEY,
        JSON.stringify([
            ...withoutDuplicate,
            { userId, password },
        ])
    );
}

function getUserPassword(
    userId: string
): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    const stored = localStorage.getItem(PASSWORDS_KEY);

    if (!stored) {
        return null;
    }

    try {
        const passwords =
            JSON.parse(stored) as StoredPassword[];

        return (
            passwords.find(
                (item) => item.userId === userId
            )?.password ?? null
        );
    } catch {
        return null;
    }
}

export function login(
    email: string,
    password: string
): User | null {
    const normalizedEmail =
        email.trim().toLowerCase();

    const availableUsers =
        getRegisteredUsers();

    const user = availableUsers.find(
        (item) =>
            item.email.trim().toLowerCase() ===
            normalizedEmail
    );

    if (!user) {
        return null;
    }

    const savedPassword =
        getUserPassword(user.id);

    const validPassword =
        savedPassword !== null
            ? password === savedPassword
            : password === "123456";

    if (!validPassword) {
        return null;
    }

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
    );

    return user;
}

export function register(
    firstName: string,
    lastName: string,
    email: string,
    password: string
): User | null {
    if (typeof window === "undefined") {
        return null;
    }

    const normalizedEmail =
        email.trim().toLowerCase();

    const existingUser =
        getRegisteredUsers().find(
            (item) =>
                item.email.trim().toLowerCase() ===
                normalizedEmail
        );

    if (existingUser) {
        return null;
    }

    if (password.length < 6) {
        return null;
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: normalizedEmail,
        role: "user",
    };

    saveRegisteredUser(newUser);
    saveUserPassword(newUser.id, password);

    return newUser;
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
