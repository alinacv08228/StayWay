"use client";

import Link from "next/link";
import { Property } from "../types/types";
import { useSettings } from "../context/SettingsContext";
import { currencyInfo } from "../data/currency";
import { getTranslation } from "../data/translations";

type PropertyCardProps = {
    property: Property;
};

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

    const convertedPrice =
        property.pricePerNight *
        selectedCurrency.rate;

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
                <h3>{property.name}</h3>

                <p>{property.address}</p>

                <p className="property-rating">
                    ★ {property.rating}
                </p>

                <p className="property-price">
                    {selectedCurrency.symbol}
                    {Math.round(
                        convertedPrice
                    ).toLocaleString()}
                    {" / "}
                    {getTranslation(
                        language,
                        "perNight"
                    )}
                </p>
            </div>
        </Link>
    );
}