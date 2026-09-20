"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import { User } from "../types/types";

import {
    getCurrentUser,
    logout as logoutService,
} from "../services/authService";

type UserContextType = {
    currentUser: User | null;
    setCurrentUser: (
        user: User | null
    ) => void;
    logout: () => void;
    isLoading: boolean;
};

const TOKEN_EXPIRATION_KEY =
    "stayway_auth_expires_at";

const AUTH_INVALID_EVENT =
    "stayway-auth-invalid";

const UserContext =
    createContext<
        UserContextType | undefined
    >(undefined);

export function UserProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [
        currentUser,
        setCurrentUser,
    ] =
        useState<User | null>(
            null
        );

    const [
        isLoading,
        setIsLoading,
    ] =
        useState(true);

    const logout =
        useCallback(() => {
            logoutService();

            setCurrentUser(
                null
            );
        }, []);

    /*
     * Restore the authenticated user
     * when the application starts.
     *
     * Also synchronize the context when:
     * - the API reports an invalid/expired JWT;
     * - authentication changes in another tab.
     */
    useEffect(() => {
        const syncCurrentUser =
            () => {
                setCurrentUser(
                    getCurrentUser()
                );
            };

        syncCurrentUser();

        setIsLoading(false);

        const handleInvalidAuth =
            () => {
                setCurrentUser(
                    null
                );
            };

        const handleStorageChange =
            (
                event:
                    StorageEvent
            ) => {
                if (
                    event.key ===
                        "stayway_auth_token" ||
                    event.key ===
                        "stayway_current_user" ||
                    event.key ===
                        TOKEN_EXPIRATION_KEY
                ) {
                    syncCurrentUser();
                }
            };

        window.addEventListener(
            AUTH_INVALID_EVENT,
            handleInvalidAuth
        );

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        return () => {
            window.removeEventListener(
                AUTH_INVALID_EVENT,
                handleInvalidAuth
            );

            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };
    }, []);

    /*
     * The user context must not remain
     * authenticated after the JWT expires
     * while the browser tab stays open.
     */
    useEffect(() => {
        if (
            isLoading ||
            !currentUser
        ) {
            return;
        }

        const storedExpiration =
            localStorage.getItem(
                TOKEN_EXPIRATION_KEY
            );

        if (!storedExpiration) {
            /*
             * getCurrentUser() performs
             * JWT validation itself.
             */
            const validUser =
                getCurrentUser();

            if (!validUser) {
                setCurrentUser(
                    null
                );
            }

            return;
        }

        const expirationTime =
            Date.parse(
                storedExpiration
            );

        if (
            Number.isNaN(
                expirationTime
            )
        ) {
            logout();
            return;
        }

        const remainingTime =
            expirationTime -
            Date.now();

        if (
            remainingTime <= 0
        ) {
            logout();
            return;
        }

        const timeout =
            window.setTimeout(
                () => {
                    logout();
                },
                remainingTime
            );

        return () => {
            window.clearTimeout(
                timeout
            );
        };
    }, [
        currentUser,
        isLoading,
        logout,
    ]);

    return (
        <UserContext.Provider
            value={{
                currentUser,
                setCurrentUser,
                logout,
                isLoading,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context =
        useContext(
            UserContext
        );

    if (!context) {
        throw new Error(
            "useUser must be used inside UserProvider"
        );
    }

    return context;
}
