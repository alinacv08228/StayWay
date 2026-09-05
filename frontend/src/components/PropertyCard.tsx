"use client";

import Link from "next/link";
import { Property } from "../types/types";
import { useSettings } from "../context/SettingsContext";
import { currencyInfo } from "../data/currency";
import { getTranslation } from "../data/translations";
import { rooms } from "../data/mockData";

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

    const convertedPrice =
        property.pricePerNight *
        selectedCurrency.rate;

    const propertyRooms = rooms.filter(
        (room) => room.propertyId === property.id
    );

    const firstRoom = propertyRooms[0];

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
                            {firstRoom.size}
                            {" · "}
                            {firstRoom.bed}
                        </p>

                        <div className="property-features">
                            {firstRoom.features
                                .slice(0, 3)
                                .map((feature) => (
                                    <span key={feature}>
                                        <span className="checkmark">
                                            ✓
                                        </span>
                                        {feature}
                                    </span>
                                ))}
                        </div>
                    </div>
                )}

                <div className="property-bottom">
                    <div className="property-benefits">
                        <span>
                            <span className="checkmark">
                                ✓
                            </span>
                            Free cancellation
                        </span>

                        <span>
                            <span className="checkmark">
                                ✓
                            </span>
                            No prepayment needed
                        </span>
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