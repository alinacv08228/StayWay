import axios from "axios";

const SESSION_KEY =
    "stayway_current_user";

const TOKEN_KEY =
    "stayway_auth_token";

const TOKEN_EXPIRATION_KEY =
    "stayway_auth_expires_at";

const AUTH_INVALID_EVENT =
    "stayway-auth-invalid";

type JwtPayload = {
    exp?: number;
    [key: string]: unknown;
};

function clearStoredAuthentication() {
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

function notifyInvalidAuthentication() {
    if (
        typeof window ===
        "undefined"
    ) {
        return;
    }

    window.dispatchEvent(
        new Event(
            AUTH_INVALID_EVENT
        )
    );
}

function decodeToken(
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

function getValidStoredToken():
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
        decodeToken(token);

    if (
        !payload ||
        typeof payload.exp !==
        "number"
    ) {
        clearStoredAuthentication();
        notifyInvalidAuthentication();

        return null;
    }

    const expirationTime =
        payload.exp * 1000;

    if (
        expirationTime <=
        Date.now()
    ) {
        clearStoredAuthentication();
        notifyInvalidAuthentication();

        return null;
    }

    return token;
}

const api =
    axios.create({
        baseURL:
            process.env
                .NEXT_PUBLIC_API_URL ??
            "http://localhost:5131",

        headers: {
            "Content-Type":
                "application/json",
        },
    });

api.interceptors.request.use(
    (config) => {
        if (
            typeof window ===
            "undefined"
        ) {
            return config;
        }

        const token =
            getValidStoredToken();

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }

        return config;
    }
);

api.interceptors.response.use(
    (response) =>
        response,

    (error) => {
        if (
            typeof window !==
            "undefined" &&
            axios.isAxiosError(error) &&
            error.response?.status ===
            401
        ) {
            /*
             * Un 401 de la login nu înseamnă că
             * sesiunea existentă a expirat.
             *
             * Curățăm autentificarea numai dacă
             * exista deja un token salvat.
             */

            const hadStoredToken =
                Boolean(
                    localStorage.getItem(
                        TOKEN_KEY
                    )
                );

            if (hadStoredToken) {
                clearStoredAuthentication();

                notifyInvalidAuthentication();
            }
        }

        return Promise.reject(error);
    }
);

export function isUnauthorizedApiError(
    error: unknown
): boolean {
    return (
        axios.isAxiosError(error) &&
        error.response?.status === 401
    );
}

export default api;