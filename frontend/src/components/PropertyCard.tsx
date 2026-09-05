"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Property, Room } from "../types/types";
import { useSettings } from "../context/SettingsContext";
import { currencyInfo } from "../data/currency";
import { getTranslation } from "../data/translations";
import { getRoomsByPropertyId } from "../services/roomService";

type PropertyCardProps = {
    property: Property;
};

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

    /*
     * Old mock rooms already contain the unit,
     * for example "20–25 m²".
     *
     * New rooms created by Admin contain only
     * the numeric value, for example 30.
     *
     * Therefore we add m² only for numeric values.
     */
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
                            Excellent
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
                                ? `Up to ${firstRoom.guests} guests`
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
                                    {firstRoom.bed}
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
                                            {feature}
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
                                Free cancellation
                            </span>
                        )}

                        {(!firstRoom ||
                            firstRoom.noPrepayment !==
                            false) && (
                            <span>
                                <span className="checkmark">
                                    ✓
                                </span>
                                No prepayment needed
                            </span>
                        )}
                    </div>

                    <div className="property-price-box">
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
                </div>
            </div>
        </Link>
    );
}