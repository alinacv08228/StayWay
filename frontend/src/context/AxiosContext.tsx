"use client";

import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
} from "react";

import { AxiosInstance } from "axios";
import { useRouter } from "next/navigation";

import api from "../lib/api";

const AxiosContext =
    createContext<AxiosInstance | null>(null);

type AxiosProviderProps = {
    children: ReactNode;
};

export function AxiosProvider({
                                  children,
                              }: AxiosProviderProps) {
    const router = useRouter();

    useEffect(() => {
        const responseInterceptor =
            api.interceptors.response.use(
                (response) => response,

                (error) => {
                    const status =
                        error.response?.status;

                    if (status === 401) {
                        router.push("/401");
                    } else if (status === 403) {
                        router.push("/403");
                    } else if (status === 404) {
                        router.push("/404");
                    } else if (status >= 500) {
                        router.push("/500");
                    }

                    return Promise.reject(error);
                }
            );

        return () => {
            api.interceptors.response.eject(
                responseInterceptor
            );
        };
    }, [router]);

    return (
        <AxiosContext.Provider value={api}>
            {children}
        </AxiosContext.Provider>
    );
}

export function useAxios(): AxiosInstance {
    const context =
        useContext(AxiosContext);

    if (!context) {
        throw new Error(
            "useAxios must be used inside AxiosProvider"
        );
    }

    return context;
}