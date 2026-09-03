"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageCurrencyModal from "./LanguageCurrencyModal";
import { useSettings } from "../context/SettingsContext";
import { getTranslation } from "../data/translations";

export default function Header() {
    const [isLanguageModalOpen, setIsLanguageModalOpen] =
        useState(false);

    const { language } = useSettings();

    const t = (
        key:
            | "home"
            | "destinations"
            | "stays"
            | "myBookings"
            | "admin"
    ) => getTranslation(language, key);

    return (
        <header className="header">
            <div className="header-inner">
                <Link href="/" className="logo">
                    <span className="logo-icon">✦</span>

                    <span className="logo-text">
                        StayWay
                    </span>
                </Link>

                <nav className="nav">
                    <Link href="/">
                        {t("home")}
                    </Link>

                    <Link href="/destinations">
                        {t("destinations")}
                    </Link>

                    <Link href="/stays">
                        {t("stays")}
                    </Link>

                    <Link href="/bookings">
                        {t("myBookings")}
                    </Link>

                    <button
                        type="button"
                        className="language-button"
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