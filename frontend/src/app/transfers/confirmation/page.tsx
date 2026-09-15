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

            <style jsx global>{`
                /* =========================================================
                   TRANSFER CONFIRMATION — DARK MODE
                ========================================================= */

                html[data-theme="dark"] .transfer-confirmation-page {
                    background: #172338 !important;
                    color: #f5f8fc !important;
                }

                html[data-theme="dark"] .transfer-confirmation-content {
                    background: #172338 !important;
                }

                html[data-theme="dark"]
                .transfer-confirmation-content
                .transfers-container {
                    background: transparent !important;
                }

                /* Card principal */
                html[data-theme="dark"] .transfer-confirmation-card {
                    background: #0d1c2f !important;
                    border: 1px solid #304660 !important;

                    box-shadow:
                        0 24px 60px rgba(0, 0, 0, 0.22) !important;

                    color: #f5f8fc !important;
                }

                /* Icon ✓ */
                html[data-theme="dark"] .transfer-confirmation-icon {
                    background: linear-gradient(
                        135deg,
                        #7657ec,
                        #9277ff
                    ) !important;

                    color: #ffffff !important;

                    box-shadow:
                        0 12px 30px rgba(112, 82, 230, 0.28) !important;
                }

                /* STAYWAY TRANSFERS */
                html[data-theme="dark"]
                .transfer-confirmation-card
                .transfers-eyebrow {
                    color: #9b8cff !important;
                }

                /* Transfer booked */
                html[data-theme="dark"]
                .transfer-confirmation-card
                h1 {
                    color: #f7f9fc !important;
                }

                /* successfully */
                html[data-theme="dark"]
                .transfer-confirmation-card
                h1 span {
                    color: #9b8cff !important;
                }

                /* Description */
                html[data-theme="dark"]
                .transfer-confirmation-card
                p {
                    color: #aebed1 !important;
                }

                /* Button */
                html[data-theme="dark"]
                .transfer-confirmation-button {
                    background: #6d55e8 !important;
                    color: #ffffff !important;

                    box-shadow:
                        0 10px 24px rgba(109, 85, 232, 0.22) !important;
                }

                html[data-theme="dark"]
                .transfer-confirmation-button:hover {
                    background: #7b64ef !important;
                }
            `}</style>

        </main>
    );
}