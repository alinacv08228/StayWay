"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import LanguageCurrencyModal from "./LanguageCurrencyModal";
import { useSettings } from "../context/SettingsContext";
import { getTranslation } from "../data/translations";
import { useUser } from "../context/UserContext";

export default function Header() {
    const [isLanguageModalOpen, setIsLanguageModalOpen] =
        useState(false);

    const { language, theme, setTheme } = useSettings();
    const { currentUser, logout } = useUser();

    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    const t = (
        key:
            | "home"
            | "destinations"
            | "stays"
            | "myBookings"
            | "admin"
    ) => getTranslation(language, key);

    const isActive = (path: string) => {
        if (path === "/") {
            return pathname === "/";
        }

        return pathname.startsWith(path);
    };

    return (
        <header className="header">
            <div className="header-inner">

                <Link href="/" className="logo">
                    <span className="logo-icon">✦</span>
                    <span className="logo-text">StayWay</span>
                </Link>

                <nav className="nav">

                    <Link
                        href="/"
                        className={`nav-link ${
                            isActive("/")
                                ? "active"
                                : ""
                        }`}
                    >
                        {t("home")}
                    </Link>

                    <Link
                        href="/destinations"
                        className={`nav-link ${
                            isActive("/destinations")
                                ? "active"
                                : ""
                        }`}
                    >
                        {t("destinations")}
                    </Link>

                    <Link
                        href="/stays"
                        className={`nav-link ${
                            isActive("/stays")
                                ? "active"
                                : ""
                        }`}
                    >
                        {t("stays")}
                    </Link>

                    <Link
                        href="/bookings"
                        className={`nav-link ${
                            isActive("/bookings")
                                ? "active"
                                : ""
                        }`}
                    >
                        {t("myBookings")}
                    </Link>

                    <Link
                        href="/help"
                        className={`nav-link ${
                            isActive("/help")
                                ? "active"
                                : ""
                        }`}
                    >
                        Help & Support
                    </Link>

                    {currentUser?.role === "admin" && (
                        <Link
                            href="/admin"
                            className={`nav-link ${
                                isActive("/admin")
                                    ? "active"
                                    : ""
                            }`}
                        >
                            {t("admin")}
                        </Link>
                    )}

                    {currentUser ? (
                        <button
                            type="button"
                            className="nav-link nav-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className={`nav-link ${
                                isActive("/login")
                                    ? "active"
                                    : ""
                            }`}
                        >
                            Login
                        </Link>
                    )}

                    <button
                        type="button"
                        className="nav-link nav-icon-button"
                        onClick={() =>
                            setTheme(
                                theme === "light"
                                    ? "dark"
                                    : "light"
                            )
                        }
                        aria-label={
                            theme === "light"
                                ? "Switch to dark mode"
                                : "Switch to light mode"
                        }
                    >
                        {theme === "light"
                            ? "🌙"
                            : "☀️"}
                    </button>

                    <button
                        type="button"
                        className="nav-link nav-icon-button"
                        onClick={() =>
                            setIsLanguageModalOpen(true)
                        }
                        aria-label="Choose language and currency"
                    >
                        🌐
                    </button>

                </nav>

                <LanguageCurrencyModal
                    isOpen={isLanguageModalOpen}
                    onClose={() =>
                        setIsLanguageModalOpen(false)
                    }
                />

            </div>
        </header>
    );
}