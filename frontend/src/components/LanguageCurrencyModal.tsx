"use client";

import { useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";

type LanguageCurrencyModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const languages = [
    ["English", "United States"],
    ["English", "United Kingdom"],
    ["English", "Australia"],
    ["English", "Canada"],
    ["English", "India"],
    ["English", "Ireland"],
    ["English", "New Zealand"],
    ["English", "Singapore"],
    ["English", "United Arab Emirates"],
    ["Română", "România"],
    ["Русский", "Россия"],
    ["Українська", "Україна"],
    ["Français", "France"],
    ["Français", "Canada"],
    ["Español", "España"],
    ["Español", "México"],
    ["Español", "Argentina"],
    ["Deutsch", "Deutschland"],
    ["Deutsch", "Österreich"],
    ["Deutsch", "Schweiz"],
    ["Italiano", "Italia"],
    ["Português", "Portugal"],
    ["Português", "Brasil"],
    ["Nederlands", "Nederland"],
    ["Norsk", "Norge"],
    ["Svenska", "Sverige"],
    ["Dansk", "Danmark"],
    ["Suomi", "Suomi"],
    ["Polski", "Polska"],
    ["Čeština", "Česká republika"],
    ["Slovenčina", "Slovensko"],
    ["Magyar", "Magyarország"],
    ["Български", "България"],
    ["Hrvatski", "Hrvatska"],
    ["Slovenščina", "Slovenija"],
    ["Srpski", "Srbija"],
    ["Bosanski", "Bosna i Hercegovina"],
    ["Ελληνικά", "Ελλάδα"],
    ["Türkçe", "Türkiye"],
    ["العربية", "العربية"],
    ["עברית", "ישראל"],
    ["हिन्दी", "भारत"],
    ["ไทย", "ประเทศไทย"],
    ["Bahasa Indonesia", "Indonesia"],
    ["Tiếng Việt", "Việt Nam"],
    ["한국어", "대한민국"],
    ["日本語", "日本"],
    ["中文", "中国"],
    ["繁體中文", "台灣"],
    ["Català", "Espanya"],
    ["Eesti", "Eesti"],
    ["Latviešu", "Latvija"],
    ["Lietuvių", "Lietuva"],
];

const currencies = [
    ["United States dollar", "USD — $"],
    ["Australian dollar", "AUD — $"],
    ["Brazilian real", "BRL — R$"],
    ["Bulgarian lev", "BGN — лв."],
    ["Canadian dollar", "CAD — $"],
    ["Chilean peso", "CLP — $"],
    ["Chinese yuan", "CNY — ¥"],
    ["Colombian peso", "COP — $"],
    ["Costa Rican colón", "CRC — ₡"],
    ["Czech koruna", "CZK — Kč"],
    ["Danish krone", "DKK — kr"],
    ["Egyptian pound", "EGP — E£"],
    ["Emirati dirham", "AED — د.إ"],
    ["Euro", "EUR — €"],
    ["Ghanaian cedi", "GHS — GH₵"],
    ["Hong Kong dollar", "HKD — $"],
    ["Hungarian forint", "HUF — Ft"],
    ["Indian rupee", "INR — ₹"],
    ["Indonesian rupiah", "IDR — Rp"],
    ["Israeli new shekel", "ILS — ₪"],
    ["Japanese yen", "JPY — ¥"],
    ["Kazakhstani tenge", "KZT — ₸"],
    ["Kenyan shilling", "KES — KSh"],
    ["Malaysian ringgit", "MYR — RM"],
    ["Mexican peso", "MXN — $"],
    ["Moroccan dirham", "MAD"],
    ["New Taiwan dollar", "TWD — $"],
    ["New Zealand dollar", "NZD — $"],
    ["Norwegian krone", "NOK — kr"],
    ["Peruvian sol", "PEN — S/"],
    ["Philippine peso", "PHP — ₱"],
    ["Polish zloty", "PLN — zł"],
    ["Pound sterling", "GBP — £"],
    ["Qatari riyal", "QAR — ر.ق"],
    ["Romanian leu", "RON — lei"],
    ["Russian ruble", "RUB — ₽"],
    ["Saudi Arabian riyal", "SAR — ﷼"],
    ["Singapore dollar", "SGD — $"],
    ["South African rand", "ZAR — R"],
    ["South Korean won", "KRW — ₩"],
    ["Swedish krona", "SEK — kr"],
    ["Swiss franc", "CHF"],
    ["Thai baht", "THB — ฿"],
    ["Turkish lira", "TRY — ₺"],
    ["Ugandan shilling", "UGX — USh"],
    ["Ukrainian hryvnia", "UAH — ₴"],
];

export default function LanguageCurrencyModal({
                                                  isOpen,
                                                  onClose,
                                              }: LanguageCurrencyModalProps) {
    const {
        language,
        currency,
        setLanguage,
        setCurrency,
    } = useSettings();

    const [activeTab, setActiveTab] =
        useState<"language" | "currency">("language");

    const [selectedLanguage, setSelectedLanguage] =
        useState(language);

    const [selectedCurrency, setSelectedCurrency] =
        useState(currency);

    /*
     * Când deschidem modalul,
     * încărcăm setările actuale.
     */
    useEffect(() => {
        if (isOpen) {
            setSelectedLanguage(language);
            setSelectedCurrency(currency);
        }
    }, [isOpen, language, currency]);

    if (!isOpen) {
        return null;
    }

    /*
     * Salvăm alegerea prin SettingsContext.
     */
    const handleSave = () => {
        setLanguage(selectedLanguage);
        setCurrency(selectedCurrency);

        onClose();
    };

    return (
        <div
            className="language-modal-overlay"
            onClick={onClose}
        >
            <div
                className="language-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                {/* CLOSE */}
                <button
                    type="button"
                    className="language-modal-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>

                {/* TABS */}
                <div className="language-modal-tabs">
                    <button
                        type="button"
                        className={
                            activeTab === "language"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("language")
                        }
                    >
                        Language and region
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === "currency"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("currency")
                        }
                    >
                        Currency
                    </button>
                </div>

                {/* LANGUAGE TAB */}
                {activeTab === "language" ? (
                    <div className="language-modal-content">
                        {/* TRANSLATION */}
                       

                        {/* SUGGESTED */}
                        <h2>
                            Suggested languages and regions
                        </h2>

                        <div className="suggested-languages">
                            {[
                                ["English", "United States"],
                                ["English", "United Kingdom"],
                                ["Русский", "Россия"],
                                ["Română", "România"],
                            ].map(
                                ([languageName, region]) => {
                                    const value =
                                        `${languageName}|${region}`;

                                    return (
                                        <button
                                            type="button"
                                            key={value}
                                            className={
                                                selectedLanguage ===
                                                value
                                                    ? "selected"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setSelectedLanguage(
                                                    value
                                                )
                                            }
                                        >
                                            <strong>
                                                {languageName}
                                            </strong>

                                            <span>
                                                {region}
                                            </span>
                                        </button>
                                    );
                                }
                            )}
                        </div>

                        {/* ALL LANGUAGES */}
                        <h2>
                            Choose a language and region
                        </h2>

                        <div className="language-grid">
                            {languages.map(
                                ([languageName, region]) => {
                                    const value =
                                        `${languageName}|${region}`;

                                    return (
                                        <button
                                            type="button"
                                            key={value}
                                            className={
                                                selectedLanguage ===
                                                value
                                                    ? "selected"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setSelectedLanguage(
                                                    value
                                                )
                                            }
                                        >
                                            <strong>
                                                {languageName}
                                            </strong>

                                            <span>
                                                {region}
                                            </span>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>
                ) : (
                    /* CURRENCY TAB */
                    <div className="language-modal-content">
                        <h2>
                            Choose a currency
                        </h2>

                        <div className="currency-grid">
                            {currencies.map(
                                ([currencyName, code]) => (
                                    <button
                                        type="button"
                                        key={currencyName}
                                        className={
                                            selectedCurrency ===
                                            currencyName
                                                ? "selected"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSelectedCurrency(
                                                currencyName
                                            )
                                        }
                                    >
                                        <strong>
                                            {currencyName}
                                        </strong>

                                        <span>
                                            {code}
                                        </span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                )}

                {/* SAVE */}
                <div className="language-modal-footer">
                    <button
                        type="button"
                        className="language-modal-save"
                        onClick={handleSave}
                        aria-label="Save settings"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}