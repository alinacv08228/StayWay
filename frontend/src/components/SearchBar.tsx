"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
    const router = useRouter();

    const [destination, setDestination] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState("2");

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const params = new URLSearchParams();

        if (destination.trim()) {
            params.set("destination", destination.trim());
        }

        if (checkIn) {
            params.set("checkIn", checkIn);
        }

        if (checkOut) {
            params.set("checkOut", checkOut);
        }

        params.set("guests", guests);

        router.push(`/stays?${params.toString()}`);
    };

    return (
        <form className="search-bar" onSubmit={handleSearch}>
            <input
                className="search-destination"
                type="text"
                placeholder="Where are you going?"
                value={destination}
                onChange={(event) =>
                    setDestination(event.target.value)
                }
            />

            <input
                className="search-date"
                type="date"
                value={checkIn}
                onChange={(event) =>
                    setCheckIn(event.target.value)
                }
            />

            <input
                className="search-date"
                type="date"
                value={checkOut}
                onChange={(event) =>
                    setCheckOut(event.target.value)
                }
            />

            <select
                className="search-guests"
                value={guests}
                onChange={(event) =>
                    setGuests(event.target.value)
                }
            >
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
                <option value="5">5 guests</option>
                <option value="6">6 guests</option>
            </select>

            <button
                type="submit"
                className="search-button"
            >
                Search
            </button>
        </form>
    );
}