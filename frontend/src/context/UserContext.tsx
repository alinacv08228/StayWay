"use client";

import { createContext, useContext, useState } from "react";
import { User } from "../types/types";

type UserContextType = {
    currentUser: User;
    setCurrentUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export function UserProvider({
                                 children,
                             }: {
    children: React.ReactNode;
}) {
    const [currentUser, setCurrentUser] = useState<User>({
        id: 2,
        name: "Admin",
        email: "admin@stayway.com",
        role: "admin",
    });

    return (
        <UserContext.Provider
            value={{
                currentUser,
                setCurrentUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error(
            "useUser must be used inside UserProvider"
        );
    }

    return context;
}