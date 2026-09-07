"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import LanguageCurrencyModal from "./LanguageCurrencyModal";
import { useSettings } from "../context/SettingsContext";
import { getTranslation } from "../data/translations";
import { useUser } from "../context/UserContext";

type HeaderExtraTranslation = {
    helpSupport: string;
    logout: string;
    login: string;
};

const headerExtraTranslations: Record<string, HeaderExtraTranslation> = {
    English: {
        helpSupport: "Help & Support",
        login: "Login",
        logout: "Logout",
    },
    "Română": {
        helpSupport: "Ajutor și asistență",
        login: "Autentificare",
        logout: "Deconectare",
    },
    "Русский": {
        helpSupport: "Помощь и поддержка",
        login: "Войти",
        logout: "Выйти",
    },
    "Українська": {
        helpSupport: "Допомога та підтримка",
        login: "Увійти",
        logout: "Вийти",
    },
    "Français": {
        helpSupport: "Aide et assistance",
        login: "Connexion",
        logout: "Déconnexion",
    },
    "Español": {
        helpSupport: "Ayuda y soporte",
        login: "Iniciar sesión",
        logout: "Cerrar sesión",
    },
    "Deutsch": {
        helpSupport: "Hilfe und Support",
        login: "Anmelden",
        logout: "Abmelden",
    },
    "Italiano": {
        helpSupport: "Aiuto e assistenza",
        login: "Accedi",
        logout: "Disconnetti",
    },
    "Português": {
        helpSupport: "Ajuda e suporte",
        login: "Iniciar sessão",
        logout: "Terminar sessão",
    },
    "Nederlands": {
        helpSupport: "Hulp en ondersteuning",
        login: "Inloggen",
        logout: "Uitloggen",
    },
    "Norsk": {
        helpSupport: "Hjelp og støtte",
        login: "Logg inn",
        logout: "Logg ut",
    },
    "Svenska": {
        helpSupport: "Hjälp och support",
        login: "Logga in",
        logout: "Logga ut",
    },
    "Dansk": {
        helpSupport: "Hjælp og support",
        login: "Log ind",
        logout: "Log ud",
    },
    "Suomi": {
        helpSupport: "Ohje ja tuki",
        login: "Kirjaudu",
        logout: "Kirjaudu ulos",
    },
    "Polski": {
        helpSupport: "Pomoc i wsparcie",
        login: "Zaloguj się",
        logout: "Wyloguj się",
    },
    "Čeština": {
        helpSupport: "Nápověda a podpora",
        login: "Přihlásit se",
        logout: "Odhlásit se",
    },
    "Slovenčina": {
        helpSupport: "Pomoc a podpora",
        login: "Prihlásiť sa",
        logout: "Odhlásiť sa",
    },
    "Magyar": {
        helpSupport: "Súgó és támogatás",
        login: "Bejelentkezés",
        logout: "Kijelentkezés",
    },
    "Български": {
        helpSupport: "Помощ и поддръжка",
        login: "Вход",
        logout: "Изход",
    },
    "Hrvatski": {
        helpSupport: "Pomoć i podrška",
        login: "Prijava",
        logout: "Odjava",
    },
    "Slovenščina": {
        helpSupport: "Pomoč in podpora",
        login: "Prijava",
        logout: "Odjava",
    },
    "Srpski": {
        helpSupport: "Pomoć i podrška",
        login: "Prijavi se",
        logout: "Odjavi se",
    },
    "Bosanski": {
        helpSupport: "Pomoć i podrška",
        login: "Prijava",
        logout: "Odjava",
    },
    "Ελληνικά": {
        helpSupport: "Βοήθεια και υποστήριξη",
        login: "Σύνδεση",
        logout: "Αποσύνδεση",
    },
    "Türkçe": {
        helpSupport: "Yardım ve destek",
        login: "Giriş yap",
        logout: "Çıkış yap",
    },
    "العربية": {
        helpSupport: "المساعدة والدعم",
        login: "تسجيل الدخول",
        logout: "تسجيل الخروج",
    },
    "עברית": {
        helpSupport: "עזרה ותמיכה",
        login: "התחברות",
        logout: "התנתקות",
    },
    "हिन्दी": {
        helpSupport: "सहायता और समर्थन",
        login: "लॉग इन",
        logout: "लॉग आउट",
    },
    "ไทย": {
        helpSupport: "ความช่วยเหลือและการสนับสนุน",
        login: "เข้าสู่ระบบ",
        logout: "ออกจากระบบ",
    },
    "Bahasa Indonesia": {
        helpSupport: "Bantuan & Dukungan",
        login: "Masuk",
        logout: "Keluar",
    },
    "Tiếng Việt": {
        helpSupport: "Trợ giúp & Hỗ trợ",
        login: "Đăng nhập",
        logout: "Đăng xuất",
    },
    "한국어": {
        helpSupport: "도움말 및 지원",
        login: "로그인",
        logout: "로그아웃",
    },
    "日本語": {
        helpSupport: "ヘルプとサポート",
        login: "ログイン",
        logout: "ログアウト",
    },
    "中文": {
        helpSupport: "帮助与支持",
        login: "登录",
        logout: "退出登录",
    },
    "繁體中文": {
        helpSupport: "幫助與支援",
        login: "登入",
        logout: "登出",
    },
    "Català": {
        helpSupport: "Ajuda i suport",
        login: "Inicia sessió",
        logout: "Tanca la sessió",
    },
    "Eesti": {
        helpSupport: "Abi ja tugi",
        login: "Logi sisse",
        logout: "Logi välja",
    },
    "Latviešu": {
        helpSupport: "Palīdzība un atbalsts",
        login: "Pieteikties",
        logout: "Izrakstīties",
    },
    "Lietuvių": {
        helpSupport: "Pagalba ir palaikymas",
        login: "Prisijungti",
        logout: "Atsijungti",
    },
};

export default function Header() {
    const [isLanguageModalOpen, setIsLanguageModalOpen] =
        useState(false);

    const { language, theme, setTheme } =
        useSettings();

    const { currentUser, logout } =
        useUser();

    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();

        // After logout, go directly to the login page.
        // Protected pages such as /bookings or /admin
        // must not be opened after the user logs out.
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

    const headerText =
        headerExtraTranslations[language.split("|")[0]] ??
        headerExtraTranslations.English;

    const isActive = (path: string) => {
        if (path === "/") {
            return pathname === "/";
        }

        return pathname.startsWith(path);
    };

    return (
        <header className="header">
            <div className="header-inner">

                <Link
                    href="/"
                    className="logo"
                >
                    <span className="logo-icon">
                        ✦
                    </span>

                    <span className="logo-text">
                        StayWay
                    </span>
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
    isActive(
        "/destinations"
    )
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
                        {headerText.helpSupport}
                    </Link>

                    {currentUser?.role ===
                        "admin" && (
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
                            onClick={
                                handleLogout
                            }
                        >
                            {headerText.logout}
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
                            {headerText.login}
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
                            setIsLanguageModalOpen(
                                true
                            )
                        }
                        aria-label="Choose language and currency"
                    >
                        🌐
                    </button>

                </nav>

                <LanguageCurrencyModal
                    isOpen={
                        isLanguageModalOpen
                    }
                    onClose={() =>
                        setIsLanguageModalOpen(
                            false
                        )
                    }
                />

            </div>
        </header>
    );
}
