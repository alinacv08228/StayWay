"use client";

import Link from "next/link";

export default function TransferConfirmationPage() {
    return (
        <main className="transfer-confirmation-page">

            <section className="transfer-confirmation-content">
                <div className="transfers-container">

                    <div className="transfer-confirmation-card">

                        <div className="transfer-confirmation-icon stayway-load-in stayway-load-1">
                            ✓
                        </div>

                        <span className="transfers-eyebrow stayway-load-in stayway-load-2">
                            STAYWAY TRANSFERS
                        </span>

                        <h1 className="stayway-load-in stayway-load-3">
                            Transfer booked
                            <br />
                            <span>successfully.</span>
                        </h1>

                        <p className="stayway-load-in stayway-load-4">
                            Your transfer has been confirmed.
                            We hope you have a comfortable journey.
                        </p>

                        <Link
                            href="/transfers"
                            className="transfer-confirmation-button stayway-load-in stayway-load-5"
                        >
                            Back to transfers
                        </Link>

                    </div>

                </div>
            </section>

        </main>
    );
}