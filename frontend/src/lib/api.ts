import axios from "axios";

const TOKEN_KEY =
    "stayway_auth_token";

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

export default api;