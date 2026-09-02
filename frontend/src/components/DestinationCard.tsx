import Link from "next/link";
import { Destination } from "../types/types";

type DestinationCardProps = {
    destination: Destination;
};

export default function DestinationCard({
                                            destination,
                                        }: DestinationCardProps) {
    return (
        <Link
            href={`/destinations/${destination.id}`}
            className="destination-card"
        >
            <img
                src={destination.image}
                alt={destination.name}
            />

            <div className="destination-content">
                <h3>{destination.name}</h3>

                <p>{destination.country}</p>
            </div>
        </Link>
    );
}