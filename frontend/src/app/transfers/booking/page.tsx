"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function TransferBookingPage() {
    const searchParams = useSearchParams();

    const transferType =
        searchParams.get("transferType") || "one-way";

    const optionTitle =
        searchParams.get("optionTitle") || "Private transfer";

    const price =
        searchParams.get("price") || "32";

    const pickup =
        searchParams.get("pickup") || "—";

    const destination =
        searchParams.get("destination") || "—";

    const date =
        searchParams.get("date") || "—";

    const time =
        searchParams.get("time") || "—";

    const passengers =
        searchParams.get("passengers") || "2";

    const returnDate =
        searchParams.get("returnDate") || "—";

    const returnTime =
        searchParams.get("returnTime") || "—";

    return (
        <main className="transfer-booking-page">

            <section className="transfer-booking-hero">
                <div className="transfers-container">

                    <span className="transfers-eyebrow">
                        STAYWAY TRANSFERS
                    </span>

                    <h1>
                        Complete your
                        <br />
                        <span>transfer booking.</span>
                    </h1>

                    <p>
                        Review your transfer details and continue
                        with your booking.
                    </p>

                </div>
            </section>

            <section className="transfer-booking-content">
                <div className="transfers-container">

                    <div className="transfer-booking-card">

                        <div className="transfer-booking-card-header">

                            <div>
                                <span className="transfers-eyebrow">
                                    YOUR TRANSFER
                                </span>

                                <h2>
                                    {optionTitle}
                                </h2>
                            </div>

                            <div className="transfer-booking-price">
                                <span>from</span>

                                <strong>
                                    €{price}
                                </strong>
                            </div>

                        </div>

                        <div className="transfer-booking-route">

                            <div>
                                <span>Pick-up</span>

                                <strong>
                                    {pickup}
                                </strong>
                            </div>

                            <div className="transfer-booking-arrow">
                                →
                            </div>

                            <div>
                                <span>Destination</span>

                                <strong>
                                    {destination}
                                </strong>
                            </div>

                        </div>

                        <div className="transfer-booking-details">

                            <div>
                                <span>Date</span>

                                <strong>
                                    {date}
                                </strong>
                            </div>

                            <div>
                                <span>Time</span>

                                <strong>
                                    {time}
                                </strong>
                            </div>

                            <div>
                                <span>Passengers</span>

                                <strong>
                                    {passengers}{" "}
                                    {passengers === "1"
                                        ? "passenger"
                                        : "passengers"}
                                </strong>
                            </div>

                        </div>

                        {transferType === "return" && (
                            <div className="transfer-booking-return">

                                <span className="transfers-eyebrow">
                                    RETURN JOURNEY
                                </span>

                                <div className="transfer-booking-details">

                                    <div>
                                        <span>Return date</span>

                                        <strong>
                                            {returnDate}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Return time</span>

                                        <strong>
                                            {returnTime}
                                        </strong>
                                    </div>

                                </div>

                            </div>
                        )}

                        <div className="transfer-booking-actions">

                            <Link
                                href="/transfers"
                                className="transfer-booking-back"
                            >
                                ← Back to transfers
                            </Link>

                            <Link
                                href={`/transfers/checkout?transferType=${encodeURIComponent(
                                    transferType
                                )}&optionTitle=${encodeURIComponent(
                                    optionTitle
                                )}&price=${encodeURIComponent(
                                    price
                                )}&pickup=${encodeURIComponent(
                                    pickup
                                )}&destination=${encodeURIComponent(
                                    destination
                                )}&date=${encodeURIComponent(
                                    date
                                )}&time=${encodeURIComponent(
                                    time
                                )}&passengers=${encodeURIComponent(
                                    passengers
                                )}&returnDate=${encodeURIComponent(
                                    returnDate
                                )}&returnTime=${encodeURIComponent(
                                    returnTime
                                )}`}
                                className="transfer-booking-continue"
                            >
                                Continue
                            </Link>  

                        </div>

                    </div>

                </div>
            </section>

        </main>
    );
}