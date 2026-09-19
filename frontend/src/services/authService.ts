import api from "../lib/api";
import { User } from "../types/types";

const SESSION_KEY =
    "stayway_current_user";

const TOKEN_KEY =
    "stayway_auth_token";

const TOKEN_EXPIRATION_KEY =
    "stayway_auth_expires_at";

const USER_ID_CLAIM =
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

const NAME_CLAIM =
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";

const EMAIL_CLAIM =
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

const ROLE_CLAIM =
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

type AuthResponse = {
    token: string;
    expiresAt: string;
    user: User;
};

type JwtPayload = {
    [key: string]: unknown;
    exp?: number;
};

function decodeJwtPayload(
    token: string
): JwtPayload | null {
    try {
        const parts =
            token.split(".");

        if (parts.length !== 3) {
            return null;
        }

        const base64Url =
            parts[1];

        const base64 =
            base64Url
                .replace(/-/g, "+")
                .replace(/_/g, "/")
                .padEnd(
                    Math.ceil(
                        base64Url.length / 4
                    ) * 4,
                    "="
                );

        const binary =
            atob(base64);

        const bytes =
            Uint8Array.from(
                binary,
                (character) =>
                    character.charCodeAt(0)
            );

        const json =
            new TextDecoder()
                .decode(bytes);

        return JSON.parse(
            json
        ) as JwtPayload;
    } catch {
        return null;
    }
}

function getUserFromToken(
    token: string
): User | null {
    const payload =
        decodeJwtPayload(token);

    if (!payload) {
        return null;
    }

    const id =
        payload[USER_ID_CLAIM];

    const name =
        payload[NAME_CLAIM];

    const email =
        payload[EMAIL_CLAIM];

    const role =
        payload[ROLE_CLAIM];

    if (
        typeof id !== "string" ||
        typeof name !== "string" ||
        typeof email !== "string" ||
        (
            role !== "user" &&
            role !== "admin"
        )
    ) {
        return null;
    }

    return {
        id,
        name,
        email,
        role,
    };
}

function saveAuthentication(
    response: AuthResponse
): User | null {
    if (
        typeof window ===
        "undefined"
    ) {
        return null;
    }

    const userFromToken =
        getUserFromToken(
            response.token
        );

    if (!userFromToken) {
        return null;
    }

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(
            userFromToken
        )
    );

    localStorage.setItem(
        TOKEN_KEY,
        response.token
    );

    localStorage.setItem(
        TOKEN_EXPIRATION_KEY,
        response.expiresAt
    );

    return userFromToken;
}

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

        return saveAuthentication(
            response.data
        );
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
            await api.post<AuthResponse>(
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

        return response.data.user;
    } catch {
        return null;
    }
}

export function logout(): void {
    if (
        typeof window ===
        "undefined"
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
        typeof window ===
        "undefined"
    ) {
        return null;
    }

    const token =
        localStorage.getItem(
            TOKEN_KEY
        );

    if (!token) {
        return null;
    }

    const payload =
        decodeJwtPayload(
            token
        );

    if (
        !payload ||
        typeof payload.exp !==
        "number"
    ) {
        logout();
        return null;
    }

    const expirationTime =
        payload.exp * 1000;

    if (
        expirationTime <=
        Date.now()
    ) {
        logout();
        return null;
    }

    return token;
}

export function getCurrentUser():
    User | null {
    if (
        typeof window ===
        "undefined"
    ) {
        return null;
    }

    const token =
        getAuthToken();

    if (!token) {
        logout();
        return null;
    }

    const user =
        getUserFromToken(
            token
        );

    if (!user) {
        logout();
        return null;
    }

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
    );

    return user;
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

    return (
        user?.role === role
    );
}