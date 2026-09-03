"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "../context/SettingsContext";
import { getTranslation } from "../data/translations";

export default function SearchBar() {
    const router = useRouter();
    const { language } = useSettings();

    const [destination, setDestination] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState("2");

    const languageName = language.split("|")[0];

    const guestText = (count: number) => {
        if (languageName === "Русский") {
            if (count === 1) return "1 гость";
            if (count >= 2 && count <= 4) {
                return `${count} гостя`;
            }
            return `${count} гостей`;
        }

        if (languageName === "Română") {
            return count === 1
                ? "1 oaspete"
                : `${count} oaspeți`;
        }

        if (languageName === "Français") {
            return count === 1
                ? "1 voyageur"
                : `${count} voyageurs`;
        }

        if (languageName === "Español") {
            return count === 1
                ? "1 huésped"
                : `${count} huéspedes`;
        }

        if (languageName === "Deutsch") {
            return count === 1
                ? "1 Gast"
                : `${count} Gäste`;
        }

        if (languageName === "Italiano") {
            return count === 1
                ? "1 ospite"
                : `${count} ospiti`;
        }

        if (languageName === "Português") {
            return count === 1
                ? "1 hóspede"
                : `${count} hóspedes`;
        }

        if (languageName === "Polski") {
            return count === 1
                ? "1 gość"
                : `${count} gości`;
        }

        if (languageName === "Українська") {
            return count === 1
                ? "1 гість"
                : `${count} гостей`;
        }

        if (languageName === "中文") {
            return `${count} 位客人`;
        }

        if (languageName === "繁體中文") {
            return `${count} 位客人`;
        }

        if (languageName === "日本語") {
            return `${count} 名のゲスト`;
        }

        if (languageName === "한국어") {
            return `${count}명의 게스트`;
        }

        if (languageName === "Türkçe") {
            return `${count} misafir`;
        }

        if (languageName === "العربية") {
            return `${count} ضيوف`;
        }

        if (languageName === "Ελληνικά") {
            return count === 1
                ? "1 επισκέπτης"
                : `${count} επισκέπτες`;
        }

        if (languageName === "Nederlands") {
            return count === 1
                ? "1 gast"
                : `${count} gasten`;
        }

        if (languageName === "Norsk") {
            return count === 1
                ? "1 gjest"
                : `${count} gjester`;
        }

        if (languageName === "Svenska") {
            return count === 1
                ? "1 gäst"
                : `${count} gäster`;
        }

        if (languageName === "Dansk") {
            return count === 1
                ? "1 gæst"
                : `${count} gæster`;
        }

        if (languageName === "Suomi") {
            return count === 1
                ? "1 vieras"
                : `${count} vierasta`;
        }

        if (languageName === "Čeština") {
            return count === 1
                ? "1 host"
                : `${count} hosté`;
        }

        if (languageName === "Slovenčina") {
            return count === 1
                ? "1 hosť"
                : `${count} hostia`;
        }

        if (languageName === "Magyar") {
            return count === 1
                ? "1 vendég"
                : `${count} vendég`;
        }

        if (languageName === "Български") {
            return count === 1
                ? "1 гост"
                : `${count} гости`;
        }

        if (languageName === "Hrvatski") {
            return count === 1
                ? "1 gost"
                : `${count} gosta`;
        }

        if (languageName === "Slovenščina") {
            return count === 1
                ? "1 gost"
                : `${count} gostov`;
        }

        if (languageName === "Srpski") {
            return count === 1
                ? "1 gost"
                : `${count} gostiju`;
        }

        if (languageName === "Bosanski") {
            return count === 1
                ? "1 gost"
                : `${count} gostiju`;
        }

        if (languageName === "עברית") {
            return `${count} אורחים`;
        }

        if (languageName === "हिन्दी") {
            return `${count} मेहमान`;
        }

        if (languageName === "ไทย") {
            return `${count} ผู้เข้าพัก`;
        }

        if (languageName === "Bahasa Indonesia") {
            return `${count} tamu`;
        }

        if (languageName === "Tiếng Việt") {
            return `${count} khách`;
        }

        if (languageName === "Català") {
            return count === 1
                ? "1 hoste"
                : `${count} hostes`;
        }

        if (languageName === "Eesti") {
            return count === 1
                ? "1 külaline"
                : `${count} külalist`;
        }

        if (languageName === "Latviešu") {
            return count === 1
                ? "1 viesis"
                : `${count} viesi`;
        }

        if (languageName === "Lietuvių") {
            return count === 1
                ? "1 svečias"
                : `${count} svečiai`;
        }

        return count === 1
            ? "1 guest"
            : `${count} guests`;
    };
    
    const handleSearch = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const params = new URLSearchParams();

        if (destination.trim()) {
            params.set(
                "destination",
                destination.trim()
            );
        }

        if (checkIn) {
            params.set("checkIn", checkIn);
        }

        if (checkOut) {
            params.set("checkOut", checkOut);
        }

        params.set("guests", guests);

        router.push(
            `/stays?${params.toString()}`
        );
    };

    return (
        <form
            className="search-bar"
            onSubmit={handleSearch}
        >
            <input
                className="search-destination"
                type="text"
                placeholder={getTranslation(
                    language,
                    "whereAreYouGoing"
                )}
                value={destination}
                onChange={(event) =>
                    setDestination(
                        event.target.value
                    )
                }
            />

            <input
                className="search-date"
                type="date"
                value={checkIn}
                onChange={(event) =>
                    setCheckIn(
                        event.target.value
                    )
                }
            />

            <input
                className="search-date"
                type="date"
                value={checkOut}
                onChange={(event) =>
                    setCheckOut(
                        event.target.value
                    )
                }
            />

            <select
                className="search-guests"
                value={guests}
                onChange={(event) =>
                    setGuests(
                        event.target.value
                    )
                }
            >
                <option value="1">
                    {guestText(1)}
                </option>

                <option value="2">
                    {guestText(2)}
                </option>

                <option value="3">
                    {guestText(3)}
                </option>

                <option value="4">
                    {guestText(4)}
                </option>

                <option value="5">
                    {guestText(5)}
                </option>

                <option value="6">
                    {guestText(6)}
                </option>
            </select>

            <button
                type="submit"
                className="search-button"
            >
                {getTranslation(
                    language,
                    "search"
                )}
            </button>
        </form>
    );
}