import axios from "axios";

const SESSION_KEY =
    "stayway_current_user";

const TOKEN_KEY =
    "stayway_auth_token";

const TOKEN_EXPIRATION_KEY =
    "stayway_auth_expires_at";

const AUTH_INVALID_EVENT =
    "stayway-auth-invalid";

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
            typeof window !==
            "undefined"
        ) {
            const token =
                localStorage.getItem(
                    TOKEN_KEY
                );

            if (token) {
                config.headers.Authorization =
                    `Bearer ${token}`;
            }
        }

        return config;
    }
);

api.interceptors.response.use(
    (response) => response,

    (error) => {
        if (
            typeof window !==
                "undefined" &&
            axios.isAxiosError(error) &&
            error.response?.status === 401
        ) {
            clearStoredAuthentication();

            window.dispatchEvent(
                new Event(
                    AUTH_INVALID_EVENT
                )
            );
        }

        return Promise.reject(error);
    }
);

export default api;
