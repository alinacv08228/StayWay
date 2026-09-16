"use client";

import { useSettings } from "../context/SettingsContext";
import { getHomeTranslation } from "../data/translations";

export default function Footer() {
    const { language } = useSettings();

    return (
        <footer>
            <p>
                © 2026 StayWay.{" "}
                {getHomeTranslation(
                    language,
                    "allRightsReserved"
                )}
            </p>
        </footer>
    );
}
