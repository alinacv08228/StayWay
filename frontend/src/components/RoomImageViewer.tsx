"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type RoomImageViewerProps = {
    image: string;
    alt: string;
};

export default function RoomImageViewer({
                                            image,
                                            alt,
                                        }: RoomImageViewerProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const modal = isOpen ? (
        <div
            className="room-photo-modal"
            onClick={() => setIsOpen(false)}
        >
            <div
                className="room-photo-modal-content"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className="room-photo-close"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close photo"
                >
                    ×
                </button>

                <img
                    src={image}
                    alt={alt}
                    className="room-photo-large"
                />
            </div>
        </div>
    ) : null;

    return (
        <>
            <button
                type="button"
                className="room-image-button"
                onClick={() => setIsOpen(true)}
                aria-label={`Open ${alt}`}
            >
                <img
                    src={image}
                    alt={alt}
                    className="room-image-clickable"
                />
            </button>

            {typeof document !== "undefined" &&
                createPortal(modal, document.body)}
        </>
    );
}