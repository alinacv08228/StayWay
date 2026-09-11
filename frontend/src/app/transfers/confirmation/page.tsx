"use client";

import Link from "next/link";

export default function TransferConfirmationPage() {
    return (
        <main className="transfer-confirmation-page">

            <section className="transfer-confirmation-content">
                <div className="transfers-container">

                    <div className="transfer-confirmation-card">

                        <div className="transfer-confirmation-icon">
                            ✓
                        </div>

                        <span className="transfers-eyebrow">
                            STAYWAY TRANSFERS
                        </span>

                        <h1>
                            Transfer booked
                            <br />
                            <span>successfully.</span>
                        </h1>

                        <p>
                            Your transfer has been confirmed.
                            We hope you have a comfortable journey.
                        </p>

                        <Link
                            href="/transfers"
                            className="transfer-confirmation-button"
                        >
                            Back to transfers
                        </Link>

                    </div>

                </div>
            </section>

        </main>
    );
}