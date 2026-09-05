"use client";

import { usePathname } from "next/navigation";

import Header from "./Header";
import Footer from "./Footer";

import { useUser } from "../context/UserContext";

export default function SiteShell({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const {
        currentUser,
        isLoading,
    } = useUser();

    const isProtectedPage =
        pathname.startsWith("/bookings") ||
        pathname.startsWith("/admin");

    const hideFooter =
        isProtectedPage &&
        (isLoading || !currentUser);

    return (
        <>
            <Header />

            {children}

            {!hideFooter && <Footer />}
        </>
    );
}