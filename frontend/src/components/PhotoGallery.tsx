"use client";

import { useEffect, useState } from "react";

import { useSettings } from "../context/SettingsContext";
import { getStayUiTranslation } from "../data/translations";

type PhotoGalleryProps = {
    hotelName: string;
    photos: string[];
};

export default function PhotoGallery({
                                         hotelName,
                                         photos,
                                     }: PhotoGalleryProps) {
    const { language } = useSettings();
    const [isOpen, setIsOpen] = useState(false);

    const validPhotos = photos.filter(Boolean);

    const galleryPhotos = [
        validPhotos[0],
        validPhotos[1] ?? validPhotos[0],
        validPhotos[2] ?? validPhotos[0],
        validPhotos[3] ?? validPhotos[0],
    ];

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, [isOpen]);

    if (validPhotos.length === 0) {
        return null;
    }

    return (
        <>
            <div className="stay-gallery">
                <button
                    type="button"
                    className="gallery-main gallery-clickable"
                    onClick={() => setIsOpen(true)}
                    aria-label={
                        getStayUiTranslation(
                            language,
                            "allPhotos"
                        )
                    }
                >
                    <img
                        src={galleryPhotos[0]}
                        alt={hotelName}
                    />
                </button>

                <div className="gallery-small">
                    <button
                        type="button"
                        className="gallery-clickable"
                        onClick={() => setIsOpen(true)}
                    >
                        <img
                            src={galleryPhotos[1]}
                            alt={`${hotelName} view`}
                        />
                    </button>

                    <button
                        type="button"
                        className="gallery-clickable"
                        onClick={() => setIsOpen(true)}
                    >
                        <img
                            src={galleryPhotos[2]}
                            alt={`${hotelName} interior`}
                        />
                    </button>
                </div>

                <div className="gallery-small">
                    <button
                        type="button"
                        className="gallery-clickable"
                        onClick={() => setIsOpen(true)}
                    >
                        <img
                            src={galleryPhotos[3]}
                            alt={`${hotelName} room`}
                        />
                    </button>

                    <button
                        type="button"
                        className="gallery-more"
                        onClick={() => setIsOpen(true)}
                    >
                        <img
                            src={galleryPhotos[0]}
                            alt={`${hotelName} hotel`}
                        />

                        <span>
                            {getStayUiTranslation(
                                language,
                                "viewAllPhotos"
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {isOpen && (
                <div
                    className="photo-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label={getStayUiTranslation(
                        language,
                        "allPhotos"
                    )}
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setIsOpen(false);
                        }
                    }}
                >
                    <div className="photo-modal-content">
                        <div className="photo-modal-header">
                            <h2>
                                {getStayUiTranslation(
                                    language,
                                    "allPhotos"
                                )}
                            </h2>

                            <button
                                type="button"
                                className="photo-modal-close"
                                onClick={() =>
                                    setIsOpen(false)
                                }
                                aria-label={getStayUiTranslation(
                                    language,
                                    "close"
                                )}
                            >
                                ×
                            </button>
                        </div>

                        <div className="photo-modal-grid">
                            {validPhotos.map(
                                (photo, index) => (
                                    <img
                                        key={`${photo}-${index}`}
                                        src={photo}
                                        alt={`${hotelName} ${
                                            index + 1
                                        }`}
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
