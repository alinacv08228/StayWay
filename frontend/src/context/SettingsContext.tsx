"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

type SettingsContextType = {
    language: string;
    currency: string;
    setLanguage: (language: string) => void;
    setCurrency: (currency: string) => void;
};

const SettingsContext =
    createContext<SettingsContextType | undefined>(
        undefined
    );

export function SettingsProvider({
                                     children,
                                 }: {
    children: React.ReactNode;
}) {
    const [language, setLanguageState] =
        useState("English|United States");

    const [currency, setCurrencyState] =
        useState("Euro");

    useEffect(() => {
        const savedLanguage =
            localStorage.getItem("stayway_language");

        const savedCurrency =
            localStorage.getItem("stayway_currency");

        if (savedLanguage) {
            setLanguageState(savedLanguage);
        }

        if (savedCurrency) {
            setCurrencyState(savedCurrency);
        }
    }, []);

    const setLanguage = (value: string) => {
        setLanguageState(value);

        localStorage.setItem(
            "stayway_language",
            value
        );

        const [languageCode] = value.split("|");

        document.documentElement.lang =
            languageCode === "Русский"
                ? "ru"
                : languageCode === "Română"
                    ? "ro"
                    : languageCode === "Français"
                        ? "fr"
                        : languageCode === "Español"
                            ? "es"
                            : languageCode === "Deutsch"
                                ? "de"
                                : languageCode === "Italiano"
                                    ? "it"
                                    : languageCode === "Português"
                                        ? "pt"
                                        : languageCode === "Polski"
                                            ? "pl"
                                            : languageCode === "Українська"
                                                ? "uk"
                                                : "en";
    };

    const setCurrency = (value: string) => {
        setCurrencyState(value);

        localStorage.setItem(
            "stayway_currency",
            value
        );
    };

    return (
        <SettingsContext.Provider
            value={{
                language,
                currency,
                setLanguage,
                setCurrency,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error(
            "useSettings must be used inside SettingsProvider"
        );
    }

    return context;
}