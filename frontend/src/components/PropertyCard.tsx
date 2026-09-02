import Link from "next/link";
import { Property } from "../types/types";

type PropertyCardProps = {
    property: Property;
};

export default function PropertyCard({
                                         property,
                                     }: PropertyCardProps) {
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
                    €{property.pricePerNight} / night
                </p>
            </div>
        </Link>
    );
}