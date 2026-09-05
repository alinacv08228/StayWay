"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useSettings } from "../context/SettingsContext";
import { currencyInfo } from "../data/currency";

import RoomImageViewer from "./RoomImageViewer";
import { getRoomsByPropertyId } from "../services/roomService";
import { Room } from "../types/types";

type DynamicRoomListProps = {
    propertyId: number;
    initialRooms: Room[];
};

export default function DynamicRoomList({
                                            propertyId,
                                            initialRooms,
                                        }: DynamicRoomListProps) {
    const { currency } = useSettings();

    const selectedCurrency =
        currencyInfo[currency] ??
        currencyInfo["Euro"];
    
    const [propertyRooms, setPropertyRooms] =
        useState<Room[]>(initialRooms);

    useEffect(() => {
        setPropertyRooms(
            getRoomsByPropertyId(propertyId)
        );
    }, [propertyId]);

    if (propertyRooms.length === 0) {
        return (
            <div className="home-empty-state">
                <h3>No rooms available</h3>

                <p>
                    This property currently has no
                    rooms available for booking.
                </p>
            </div>
        );
    }

    return (
        <div className="rooms-list">
            {propertyRooms.map((room) => {
                const formattedRoomSize =
                    room.size !== undefined &&
                    room.size !== null &&
                    room.size !== ""
                        ? typeof room.size === "number"
                            ? `${room.size} m²`
                            : room.size
                        : "";

                return (
                    <div
                        className="room-card"
                        key={room.id}
                    >
                        <div className="room-image">
                            <RoomImageViewer
                                image={room.image}
                                alt={room.name}
                            />
                        </div>

                        <div className="room-details">
                            <h3>{room.name}</h3>

                            <p className="room-description">
                                {room.description}
                            </p>

                            <div className="room-meta">
                                <span>
                                    👤 Up to{" "}
                                    {room.guests} guests
                                </span>

                                {formattedRoomSize && (
                                    <span>
                                        📐{" "}
                                        {formattedRoomSize}
                                    </span>
                                )}

                                <span>
                                    🛏️ {room.bed}
                                </span>
                            </div>

                            <div className="room-features">
                                {room.features
                                    .slice(0, 3)
                                    .map((feature) => (
                                        <span
                                            key={feature}
                                        >
                                            ✓ {feature}
                                        </span>
                                    ))}
                            </div>

                            <div className="room-policies">
                                {room.freeCancellation !==
                                    false && (
                                        <span>
                                        ✓ Free cancellation
                                    </span>
                                    )}

                                {room.noPrepayment !==
                                    false && (
                                        <span>
                                        ✓ No prepayment
                                        needed
                                    </span>
                                    )}
                            </div>
                        </div>

                        <div className="room-price">
                            <strong>
                                {selectedCurrency.symbol}
                                {Math.round(
                                    room.pricePerNight *
                                    selectedCurrency.rate
                                ).toLocaleString()}
                            </strong>

                            <span>/ night</span>

                            <small>
                                + taxes and fees
                            </small>

                            <Link
                                href={`/bookings/new?propertyId=${propertyId}&roomId=${room.id}`}
                                className="room-button"
                            >
                                Select room
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}