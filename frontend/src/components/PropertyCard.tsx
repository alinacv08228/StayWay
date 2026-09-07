"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Property, Room } from "../types/types";
import { useSettings } from "../context/SettingsContext";
import { currencyInfo } from "../data/currency";
import {
    getTranslation,
    getLocalizedRoomFeature,
    getLocalizedBedType,
} from "../data/translations";
import { getRoomsByPropertyId } from "../services/roomService";

type PropertyCardProps = {
    property: Property;
};


function getGuestsText(
    count: number,
    language: string
): string {
    const languageName =
        language.split("|")[0];

    switch (languageName) {
        case "Română":
            return `Până la ${count} ${
                count === 1
                    ? "oaspete"
                    : "oaspeți"
            }`;

        case "Русский":
            return `До ${count} ${
                count === 1
                    ? "гостя"
                    : count >= 2 && count <= 4
                        ? "гостей"
                        : "гостей"
            }`;

        case "Українська":
            return `До ${count} ${
                count === 1
                    ? "гостя"
                    : count >= 2 && count <= 4
                        ? "гостей"
                        : "гостей"
            }`;

        case "Français":
            return `Jusqu'à ${count} ${
                count > 1
                    ? "voyageurs"
                    : "voyageur"
            }`;

        case "Español":
            return `Hasta ${count} ${
                count > 1
                    ? "huéspedes"
                    : "huésped"
            }`;

        case "Deutsch":
            return `Bis zu ${count} ${
                count === 1
                    ? "Gast"
                    : "Gäste"
            }`;

        case "Italiano":
            return `Fino a ${count} ${
                count === 1
                    ? "ospite"
                    : "ospiti"
            }`;

        case "Português":
            return `Até ${count} ${
                count === 1
                    ? "hóspede"
                    : "hóspedes"
            }`;

        case "Nederlands":
            return `Tot ${count} ${
                count === 1
                    ? "gast"
                    : "gasten"
            }`;

        case "Polski":
            return `Do ${count} ${
                count === 1
                    ? "gościa"
                    : "gości"
            }`;

        case "Čeština":
            return `Až ${count} ${
                count === 1
                    ? "host"
                    : "hosté"
            }`;

        case "Ελληνικά":
            return `Έως ${count} ${
                count === 1
                    ? "επισκέπτη"
                    : "επισκέπτες"
            }`;

        case "Български":
            return `До ${count} ${
                count === 1
                    ? "гост"
                    : "гости"
            }`;

        case "Türkçe":
            return `En fazla ${count} ${
                count === 1
                    ? "misafir"
                    : "misafir"
            }`;

        case "العربية":
            return `حتى ${count} ضيوف`;

        case "עברית":
            return `עד ${count} ${
                count === 1
                    ? "אורח"
                    : "אורחים"
            }`;

        case "हिन्दी":
            return `${count} मेहमानों तक`;

        case "ไทย":
            return `สูงสุด ${count} ผู้เข้าพัก`;

        case "Bahasa Indonesia":
            return `Hingga ${count} tamu`;

        case "Tiếng Việt":
            return `Tối đa ${count} khách`;

        case "한국어":
            return `최대 ${count}명`;

        case "日本語":
            return `${count}名まで`;

        case "中文":
            return `最多 ${count} 位客人`;

        case "繁體中文":
            return `最多 ${count} 位房客`;

        case "Català":
            return `Fins a ${count} ${
                count === 1
                    ? "hoste"
                    : "hostes"
            }`;

        case "Eesti":
            return `Kuni ${count} külalist`;

        case "Latviešu":
            return `Līdz ${count} viesiem`;

        case "Lietuvių":
            return `Iki ${count} svečių`;

        case "Slovenčina":
            return `Až ${count} ${
                count === 1
                    ? "hosť"
                    : "hostí"
            }`;

        case "Magyar":
            return `Legfeljebb ${count} ${
                count === 1
                    ? "vendég"
                    : "vendég"
            }`;

        case "Hrvatski":
            return `Do ${count} ${
                count === 1
                    ? "gosta"
                    : "gostiju"
            }`;

        case "Slovenščina":
            return `Do ${count} gostov`;

        case "Srpski":
            return `Do ${count} ${
                count === 1
                    ? "gosta"
                    : "gostiju"
            }`;

        case "Bosanski":
            return `Do ${count} ${
                count === 1
                    ? "gosta"
                    : "gostiju"
            }`;

        case "Norsk":
            return `Opptil ${count} ${
                count === 1
                    ? "gjest"
                    : "gjester"
            }`;

        case "Svenska":
            return `Upp till ${count} ${
                count === 1
                    ? "gäst"
                    : "gäster"
            }`;

        case "Dansk":
            return `Op til ${count} ${
                count === 1
                    ? "gæst"
                    : "gæster"
            }`;

        case "Suomi":
            return `Enintään ${count} vierasta`;

        default:
            return `Up to ${count} guests`;
    }
}

export default function PropertyCard({
                                         property,
                                     }: PropertyCardProps) {
    const { language, currency } = useSettings();

    const selectedCurrency =
        currencyInfo[currency] ??
        currencyInfo["Euro"];

    const [propertyRooms, setPropertyRooms] =
        useState<Room[]>([]);

    useEffect(() => {
        setPropertyRooms(
            getRoomsByPropertyId(property.id)
        );
    }, [property.id]);

    const firstRoom = propertyRooms[0];

    const lowestRoomPrice =
        propertyRooms.length > 0
            ? Math.min(
                ...propertyRooms.map(
                    (room) => room.pricePerNight
                )
            )
            : property.pricePerNight;

    const convertedPrice =
        lowestRoomPrice * selectedCurrency.rate;

    const roomFeatures =
        firstRoom?.features ?? [];

    const formattedRoomSize =
        firstRoom &&
        firstRoom.size !== undefined &&
        firstRoom.size !== null &&
        firstRoom.size !== ""
            ? typeof firstRoom.size === "number"
                ? `${firstRoom.size} m²`
                : firstRoom.size
            : "";

    return (
        <Link
            href={`/stays/${property.id}`}
            className="property-card"
        >
            <div className="property-image">
                <img
                    src={property.image}
                    alt={property.name}
                />
            </div>

            <div className="property-content">
                <div className="property-main-info">
                    <div>
                        <h3>{property.name}</h3>

                        <p className="property-address">
                            {property.address}
                        </p>
                    </div>

                    <div className="property-rating-box">
                        <span className="property-rating-label">
                            {getTranslation(
                                language,
                                "excellent"
                            )}
                        </span>

                        <span className="property-rating">
                            {property.rating}
                        </span>
                    </div>
                </div>

                {firstRoom && (
                    <div className="property-room-info">
                        <strong>
                            {firstRoom.name}
                        </strong>

                        <p>
                            {firstRoom.guests
                                ? getGuestsText(
                                    firstRoom.guests,
                                    language
                                )
                                : ""}

                            {formattedRoomSize && (
                                <>
                                    {" · "}
                                    {formattedRoomSize}
                                </>
                            )}

                            {firstRoom.bed && (
                                <>
                                    {" · "}
                                    {getLocalizedBedType(
                                        firstRoom.bed,
                                        language
                                    )}
                                </>
                            )}
                        </p>

                        {roomFeatures.length > 0 && (
                            <div className="property-features">
                                {roomFeatures
                                    .slice(0, 3)
                                    .map((feature) => (
                                        <span
                                            key={feature}
                                        >
                                            <span className="checkmark">
                                                ✓
                                            </span>

                                            {getLocalizedRoomFeature(
                                                feature,
                                                language
                                            )}
                                        </span>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="property-bottom">
                    <div className="property-benefits">
                        {(!firstRoom ||
                            firstRoom.freeCancellation !==
                            false) && (
                            <span>
                                <span className="checkmark">
                                    ✓
                                </span>

                                {getTranslation(
                                    language,
                                    "freeCancellation"
                                )}
                            </span>
                        )}

                        {(!firstRoom ||
                            firstRoom.noPrepayment !==
                            false) && (
                            <span>
                                <span className="checkmark">
                                    ✓
                                </span>

                                {getTranslation(
                                    language,
                                    "noPrepayment"
                                )}
                            </span>
                        )}
                    </div>

                    <div className="property-price-box">
                        <div className="property-price-main">
        <span className="property-price">
            {selectedCurrency.symbol}
            {Math.round(
                convertedPrice
            ).toLocaleString()}
        </span>

                            <span className="property-price-label">
            /{" "}
                                {getTranslation(
                                    language,
                                    "perNight"
                                )}
        </span>
                        </div>

                        <small className="property-taxes">
                            {getTranslation(
                                language,
                                "taxesAndFees"
                            )}
                        </small>
                    </div>
                    
                </div>
            </div>
        </Link>
    );
}