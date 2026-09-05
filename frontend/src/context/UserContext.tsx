"use client";

import {
    createContext,
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
    setCurrentUser: (user: User | null) => void;
    logout: () => void;
    isLoading: boolean;
};

const UserContext =
    createContext<UserContextType | undefined>(
        undefined
    );

export function UserProvider({
                                 children,
                             }: {
    children: React.ReactNode;
}) {
    const [currentUser, setCurrentUser] =
        useState<User | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);

    useEffect(() => {
        const savedUser =
            getCurrentUser();

        if (savedUser) {
            setCurrentUser(savedUser);
        }

        setIsLoading(false);
    }, []);

    const logout = () => {
        logoutService();
        setCurrentUser(null);
    };

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
        useContext(UserContext);

    if (!context) {
        throw new Error(
            "useUser must be used inside UserProvider"
        );
    }

    return context;
}