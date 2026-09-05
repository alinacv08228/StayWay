"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

type ProtectedRouteProps = {
    children: React.ReactNode;
    requiredRole?: "user" | "admin";
};

export default function ProtectedRoute({
                                           children,
                                           requiredRole,
                                       }: ProtectedRouteProps) {
    const {
        currentUser,
        isLoading,
    } = useUser();

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!currentUser) {
            router.replace(
                `/401?from=${encodeURIComponent(pathname)}`
            );
            return;
        }

        if (
            requiredRole &&
            currentUser.role !== requiredRole
        ) {
            router.replace("/403");
        }
    }, [
        currentUser,
        isLoading,
        requiredRole,
        router,
        pathname,
    ]);

    // În timpul verificării autentificării nu afișăm nimic.
    if (isLoading) {
        return null;
    }

    // Utilizator neautentificat:
    // așteptăm redirectarea către 401.
    if (!currentUser) {
        return null;
    }

    // Utilizator autentificat, dar fără rolul necesar:
    // așteptăm redirectarea către 403.
    if (
        requiredRole &&
        currentUser.role !== requiredRole
    ) {
        return null;
    }

    return <>{children}</>;
}