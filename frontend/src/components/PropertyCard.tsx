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
    const languageName = language.split("|")[0];

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
                    : "гостей"
            }`;

        case "Українська":
            return `До ${count} ${
                count === 1
                    ? "гостя"
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
            return `En fazla ${count} misafir`;

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
            return `Legfeljebb ${count} vendég`;

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
    const {
        language,
        currency,
    } = useSettings();

    const selectedCurrency =
        currencyInfo[currency] ??
        currencyInfo["Euro"];

    const [
        propertyRooms,
        setPropertyRooms,
    ] = useState<Room[]>([]);

    useEffect(() => {
        setPropertyRooms(
            getRoomsByPropertyId(
                property.id
            )
        );
    }, [property.id]);

    const firstRoom =
        propertyRooms[0];

    const lowestRoomPrice =
        propertyRooms.length > 0
            ? Math.min(
                ...propertyRooms.map(
                    (room) =>
                        room.pricePerNight
                )
            )
            : property.pricePerNight;

    const convertedPrice =
        lowestRoomPrice *
        selectedCurrency.rate;

    const roomFeatures =
        firstRoom?.features ?? [];

    const formattedRoomSize =
        firstRoom &&
        firstRoom.size !== undefined &&
        firstRoom.size !== null &&
        firstRoom.size !== ""
            ? typeof firstRoom.size ===
            "number"
                ? `${firstRoom.size} m²`
                : String(
                    firstRoom.size
                )
                    .trim()
                    .endsWith("m²")
                    ? String(
                        firstRoom.size
                    ).trim()
                    : `${String(
                        firstRoom.size
                    ).trim()} m²`
            : "";

    return (
        <>
            <Link
                href={`/stays/${property.id}`}
                className="property-card"
            >
                {/* IMAGE */}

                <div className="property-image">
                    <img
                        src={property.image}
                        alt={property.name}
                    />
                </div>

                {/* CONTENT */}

                <div className="property-content">

                    {/* HOTEL */}

                    <div className="property-header">

                        <div className="property-title">
                            <h3>
                                {property.name}
                            </h3>

                            <p className="property-address">
                                <span>
                                    📍
                                </span>

                                {property.address}
                            </p>
                        </div>

                        <div className="property-rating">
                            <span>
                                ★
                            </span>

                            <strong>
                                {property.stars}
                            </strong>
                        </div>

                    </div>

                    {/* ROOM */}

                    {firstRoom && (
                        <div className="property-room">

                            <div className="room-title">
                                <span className="room-badge">
                                    ROOM
                                </span>

                                <strong>
                                    {firstRoom.name}
                                </strong>
                            </div>

                            <div className="room-meta">

                                {firstRoom.guests && (
                                    <span>
                                        👤{" "}
                                        {getGuestsText(
                                            firstRoom.guests,
                                            language
                                        )}
                                    </span>
                                )}

                                {formattedRoomSize && (
                                    <span>
                                        📐{" "}
                                        {formattedRoomSize}
                                    </span>
                                )}

                                {firstRoom.bed && (
                                    <span>
                                        🛏️{" "}
                                        {getLocalizedBedType(
                                            firstRoom.bed,
                                            language
                                        )}
                                    </span>
                                )}

                            </div>

                            {roomFeatures.length >
                                0 && (
                                    <div className="property-features">

                                        {roomFeatures
                                            .slice(
                                                0,
                                                3
                                            )
                                            .map(
                                                (
                                                    feature
                                                ) => (
                                                    <span
                                                        key={
                                                            feature
                                                        }
                                                        className="feature-chip"
                                                    >
                                                    <span className="feature-check">
                                                        ✓
                                                    </span>

                                                        {getLocalizedRoomFeature(
                                                            feature,
                                                            language
                                                        )}
                                                </span>
                                                )
                                            )}

                                    </div>
                                )}

                        </div>
                    )}

                    {/* FOOTER */}

                    <div className="property-footer">

                        <div className="property-benefits">

                            {(!firstRoom ||
                                firstRoom.freeCancellation !==
                                false) && (
                                <div className="benefit">
                                    <span className="benefit-check">
                                        ✓
                                    </span>

                                    <span>
                                        {getTranslation(
                                            language,
                                            "freeCancellation"
                                        )}
                                    </span>
                                </div>
                            )}

                            {(!firstRoom ||
                                firstRoom.noPrepayment !==
                                false) && (
                                <div className="benefit">
                                    <span className="benefit-check">
                                        ✓
                                    </span>

                                    <span>
                                        {getTranslation(
                                            language,
                                            "noPrepayment"
                                        )}
                                    </span>
                                </div>
                            )}

                        </div>

                        <div className="property-price-box">

                            <span className="price-from">
                                From
                            </span>

                            <div className="price-row">

                                <strong className="property-price">
                                    {
                                        selectedCurrency.symbol
                                    }
                                    {Math.round(
                                        convertedPrice
                                    ).toLocaleString()}
                                </strong>

                                <span className="per-night">
                                    /{" "}
                                    {getTranslation(
                                        language,
                                        "perNight"
                                    )}
                                </span>

                            </div>

                            <small>
                                {getTranslation(
                                    language,
                                    "taxesAndFees"
                                )}
                            </small>

                        </div>

                    </div>

                </div>
            </Link>

            <style jsx>{`

                /* ==================================
                   CARD
                ================================== */

                .property-card {
                    display: flex;
                    flex-direction: column;

                    width: 100%;

                    overflow: hidden;

                    border:
                        1px solid
                        #e5deef;

                    border-radius: 20px;

                    background:
                        #ffffff;

                    color:
                        #292631;

                    text-decoration: none;

                    box-shadow:
                        0 6px 20px
                        rgba(
                            55,
                            40,
                            95,
                            0.07
                        );

                    transition:
                        transform 180ms ease,
                        box-shadow 180ms ease,
                        border-color 180ms ease;
                }

                .property-card:hover {
                    transform:
                        translateY(-4px);

                    border-color:
                        #d5c9fa;

                    box-shadow:
                        0 16px 34px
                        rgba(
                            55,
                            40,
                            95,
                            0.12
                        );
                }

                /* ==================================
                   IMAGE
                ================================== */

                .property-image {
                    width: 100%;
                    height: 245px;

                    overflow: hidden;

                    background:
                        #eeeaf5;
                }

                .property-image img {
                    display: block;

                    width: 100%;
                    height: 100%;

                    object-fit: cover;

                    transition:
                        transform 300ms ease;
                }

                .property-card:hover
                .property-image img {
                    transform:
                        scale(1.025);
                }

                /* ==================================
                   CONTENT
                ================================== */

                .property-content {
                    display: flex;
                    flex-direction: column;

                    padding:
                        18px
                        20px
                        18px;

                    text-align: left;
                }

                /* ==================================
                   HEADER
                ================================== */

                .property-header {
                    display: flex;

                    align-items:
                        flex-start;

                    justify-content:
                        space-between;

                    gap: 16px;

                    width: 100%;
                }

                .property-title {
                    min-width: 0;

                    text-align: left;
                }

                .property-title h3 {
                    margin: 0;

                    color:
                        #292631;

                    font-size: 19px;

                    line-height: 1.2;

                    font-weight: 800;

                    letter-spacing:
                        -0.02em;
                }

                .property-address {
                    display: flex;

                    align-items:
                        center;

                    justify-content:
                        flex-start;

                    gap: 6px;

                    width: 100%;

                    margin:
                        7px 0 0;

                    color:
                        #777181;

                    font-size: 12px;

                    line-height: 1.45;

                    text-align: left;
                }

                .property-address span {
                    flex: 0 0 auto;
                }

                /* ==================================
                   RATING
                ================================== */

                .property-rating {
                    display:
                        inline-flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    gap: 5px;

                    flex: 0 0 auto;

                    min-width: 46px;
                    height: 36px;

                    padding:
                        0 10px;

                    border-radius:
                        11px;

                    background:
                        #f0ebff;

                    color:
                        #6049d8;

                    font-size: 13px;
                }

                .property-rating strong {
                    font-size: 13px;
                    font-weight: 800;
                }

                /* ==================================
                   ROOM
                ================================== */

                .property-room {
                    width: 100%;

                    margin-top:
                        16px;

                    padding:
                        15px 16px;

                    border:
                        1px solid
                        #e6def3;

                    border-radius:
                        16px;

                    background:
                        #faf8ff;

                    text-align:
                        left;
                }

                .room-title {
                    display: flex;

                    align-items:
                        center;

                    justify-content:
                        flex-start;

                    flex-wrap: wrap;

                    gap: 9px;

                    width: 100%;

                    text-align:
                        left;
                }

                .room-badge {
                    display:
                        inline-flex;

                    align-items:
                        center;

                    justify-content:
                        center;

                    min-height:
                        23px;

                    padding:
                        0 9px;

                    border-radius:
                        999px;

                    background:
                        #ece5ff;

                    color:
                        #684ae1;

                    font-size:
                        9px;

                    font-weight:
                        900;

                    letter-spacing:
                        0.07em;
                }

                .room-title strong {
                    color:
                        #35303e;

                    font-size:
                        15px;

                    font-weight:
                        800;
                }

                /* ==================================
                   ROOM META
                ================================== */

                .room-meta {
                    display: flex !important;

                    flex-direction:
                        row !important;

                    flex-wrap:
                        wrap !important;

                    align-items:
                        center !important;

                    justify-content:
                        flex-start !important;

                    gap:
                        9px 18px;

                    width: 100%;

                    margin-top:
                        12px;

                    color:
                        #6f687a;

                    font-size:
                        12px;

                    line-height:
                        1.5;

                    text-align:
                        left !important;
                }

                .room-meta span {
                    display:
                        inline-flex !important;

                    align-items:
                        center;

                    justify-content:
                        flex-start;

                    width: auto;

                    white-space:
                        nowrap;

                    text-align:
                        left !important;
                }

                /* ==================================
                   FEATURES
                ================================== */

                .property-features {
                    display: flex !important;

                    align-items:
                        center;

                    justify-content:
                        flex-start !important;

                    flex-wrap: wrap;

                    gap: 8px;

                    width: 100%;

                    margin-top:
                        14px;

                    text-align:
                        left !important;
                }

                .feature-chip {
                    display:
                        inline-flex;

                    align-items:
                        center;

                    gap: 6px;

                    padding:
                        6px 10px;

                    border:
                        1px solid
                        #ddd4f5;

                    border-radius:
                        999px;

                    background:
                        #ffffff;

                    color:
                        #57515f;

                    font-size:
                        11px;

                    font-weight:
                        700;
                }

                .feature-check {
                    display: grid;

                    place-items:
                        center;

                    width:
                        17px;

                    height:
                        17px;

                    flex:
                        0 0 auto;

                    border-radius:
                        50%;

                    background:
                        #7055e8;

                    color:
                        #ffffff;

                    font-size:
                        9px;

                    font-weight:
                        900;
                }

                /* ==================================
                   FOOTER
                ================================== */

                .property-footer {
                    display: flex !important;

                    align-items:
                        center !important;

                    justify-content:
                        space-between !important;

                    gap: 20px;

                    width: 100%;

                    margin-top:
                        15px;

                    padding-top:
                        15px;

                    border-top:
                        1px solid
                        #ebe6f2;

                    text-align:
                        left;
                }

                /* ==================================
                   BENEFITS
                ================================== */

                .property-benefits {
                    display: flex !important;

                    flex-direction:
                        column !important;

                    align-items:
                        flex-start !important;

                    justify-content:
                        center !important;

                    gap: 8px;

                    min-width: 0;

                    text-align:
                        left !important;
                }

                .benefit {
                    display:
                        flex !important;

                    align-items:
                        center !important;

                    justify-content:
                        flex-start !important;

                    gap: 8px;

                    width: auto;

                    color:
                        #55505e;

                    font-size:
                        12px;

                    font-weight:
                        700;

                    line-height:
                        1.35;

                    text-align:
                        left !important;
                }

                .benefit-check {
                    display: grid;

                    place-items:
                        center;

                    width:
                        20px;

                    height:
                        20px;

                    flex:
                        0 0 auto;

                    border-radius:
                        50%;

                    background:
                        #7055e8;

                    color:
                        #ffffff;

                    font-size:
                        11px;

                    font-weight:
                        900;
                }

                /* ==================================
                   PRICE
                ================================== */

                .property-price-box {
                    display: flex;

                    flex-direction:
                        column;

                    align-items:
                        flex-end;

                    justify-content:
                        center;

                    flex: 0 0 auto;

                    text-align:
                        right;
                }

                .price-from {
                    margin-bottom:
                        4px;

                    color:
                        #9891a0;

                    font-size:
                        9px;

                    font-weight:
                        800;

                    letter-spacing:
                        0.08em;

                    text-transform:
                        uppercase;
                }

                .price-row {
                    display: flex;

                    align-items:
                        baseline;

                    gap: 5px;
                }

                .property-price {
                    color:
                        #27232e;

                    font-size:
                        25px;

                    line-height: 1;

                    font-weight:
                        850;

                    letter-spacing:
                        -0.04em;
                }

                .per-night {
                    color:
                        #817a88;

                    font-size:
                        10px;

                    font-weight:
                        650;
                }

                .property-price-box small {
                    margin-top:
                        5px;

                    color:
                        #a39ca8;

                    font-size:
                        9px;

                    line-height:
                        1.3;
                }

                /* ==================================
                   DARK MODE
                ================================== */

                :global(
                    html[data-theme="dark"]
                )
                .property-card {
                    background:
                        #1d1a25;

                    border-color:
                        rgba(
                            145,
                            120,
                            255,
                            0.16
                        );

                    color:
                        #f4f1f8;
                }

                :global(
                    html[data-theme="dark"]
                )
                .property-title h3 {
                    color:
                        #f5f2fa;
                }

                :global(
                    html[data-theme="dark"]
                )
                .property-address {
                    color:
                        #aaa3b5;
                }

                :global(
                    html[data-theme="dark"]
                )
                .property-room {
                    background:
                        #25212e;

                    border-color:
                        rgba(
                            145,
                            120,
                            255,
                            0.15
                        );
                }

                :global(
                    html[data-theme="dark"]
                )
                .room-title strong {
                    color:
                        #ede9f4;
                }

                :global(
                    html[data-theme="dark"]
                )
                .room-meta {
                    color:
                        #aaa3b4;
                }

                :global(
                    html[data-theme="dark"]
                )
                .feature-chip {
                    background:
                        #2c2735;

                    border-color:
                        rgba(
                            145,
                            120,
                            255,
                            0.18
                        );

                    color:
                        #d5cfdb;
                }

                :global(
                    html[data-theme="dark"]
                )
                .property-footer {
                    border-top-color:
                        rgba(
                            255,
                            255,
                            255,
                            0.08
                        );
                }

                :global(
                    html[data-theme="dark"]
                )
                .benefit {
                    color:
                        #cbc5d1;
                }

                :global(
                    html[data-theme="dark"]
                )
                .property-price {
                    color:
                        #f6f3fa;
                }

                /* ==================================
                   RESPONSIVE
                ================================== */

                @media (
                    max-width: 760px
                ) {
                    .property-image {
                        height:
                            220px;
                    }

                    .property-content {
                        padding:
                            16px;
                    }

                    .property-footer {
                        gap:
                            14px;
                    }
                }

                @media (
                    max-width: 520px
                ) {
                    .property-footer {
                        align-items:
                            flex-start !important;

                        flex-direction:
                            column !important;
                    }

                    .property-price-box {
                        align-items:
                            flex-start;

                        text-align:
                            left;
                    }
                }

            `}</style>
        </>
    );
}