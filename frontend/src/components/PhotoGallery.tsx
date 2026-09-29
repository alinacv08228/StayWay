"use client";

import {
    useEffect,
    useState,
} from "react";

import { createPortal } from "react-dom";

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

    const [isOpen, setIsOpen] =
        useState(false);

    const [selectedIndex, setSelectedIndex] =
        useState(0);

    const [mounted, setMounted] =
        useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    /*
     * photos[0] = hotel
     * photos[1] = room 1
     * photos[2] = room 2
     * photos[3] = room 3
     * photos[4] = room 4
     */

    const hotelPhoto =
        photos[0]?.trim() || "";

    const roomPhotos = photos
        .slice(1)
        .filter(
            (photo): photo is string =>
                Boolean(photo?.trim())
        );

    /*
     * Preview:
     *
     * hotel
     * room 1
     * room 2
     * room 3
     * room 4
     *
     * Dacă o cameră lipsește,
     * se repetă poza hotelului.
     */

    const galleryPhotos = [
        hotelPhoto,
        roomPhotos[0] ?? hotelPhoto,
        roomPhotos[1] ?? hotelPhoto,
        roomPhotos[2] ?? hotelPhoto,
        roomPhotos[3] ?? hotelPhoto,
    ];

    /*
     * În viewer apar numai pozele reale.
     */

    const validPhotos = [
        hotelPhoto,
        ...roomPhotos,
    ].filter(Boolean);

    const openGallery = (
        index: number
    ) => {
        if (validPhotos.length === 0) {
            return;
        }

        const safeIndex =
            Math.min(
                index,
                validPhotos.length - 1
            );

        setSelectedIndex(safeIndex);
        setIsOpen(true);
    };

    const showPrevious = () => {
        setSelectedIndex(
            (current) =>
                current === 0
                    ? validPhotos.length - 1
                    : current - 1
        );
    };

    const showNext = () => {
        setSelectedIndex(
            (current) =>
                current ===
                validPhotos.length - 1
                    ? 0
                    : current + 1
        );
    };

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (
            event: KeyboardEvent
        ) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }

            if (
                event.key ===
                "ArrowLeft"
            ) {
                setSelectedIndex(
                    (current) =>
                        current === 0
                            ? validPhotos.length -
                            1
                            : current - 1
                );
            }

            if (
                event.key ===
                "ArrowRight"
            ) {
                setSelectedIndex(
                    (current) =>
                        current ===
                        validPhotos.length -
                        1
                            ? 0
                            : current + 1
                );
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        document.body.style.overflow =
            "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            document.body.style.overflow =
                "";
        };
    }, [
        isOpen,
        validPhotos.length,
    ]);

    if (!hotelPhoto) {
        return null;
    }

    const modal =
        mounted &&
        isOpen &&
        validPhotos.length > 0
            ? createPortal(
                <div
                    className="photo-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label={getStayUiTranslation(
                        language,
                        "allPhotos"
                    )}
                >
                    <div className="photo-modal-content photo-gallery-viewer">
                        {/* HEADER */}

                        <div className="photo-modal-header">
                            <h2>
                                {getStayUiTranslation(
                                    language,
                                    "allPhotos"
                                )}
                            </h2>

                            <div className="photo-modal-header-actions">
                                  <span className="photo-gallery-counter">
                                      {selectedIndex +
                                          1}{" "}
                                      /{" "}
                                      {
                                          validPhotos.length
                                      }
                                  </span>

                                <button
                                    type="button"
                                    className="photo-modal-close"
                                    onClick={() =>
                                        setIsOpen(
                                            false
                                        )
                                    }
                                    aria-label={getStayUiTranslation(
                                        language,
                                        "close"
                                    )}
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* MAIN PHOTO */}

                        <div className="photo-gallery-stage">
                            {validPhotos.length >
                                1 && (
                                    <button
                                        type="button"
                                        className="photo-gallery-arrow photo-gallery-arrow-left"
                                        onClick={
                                            showPrevious
                                        }
                                        aria-label="Previous photo"
                                    >
                                        ‹
                                    </button>
                                )}

                            <img
                                className="photo-gallery-main-image"
                                src={
                                    validPhotos[
                                        selectedIndex
                                        ]
                                }
                                alt={`${hotelName} ${
                                    selectedIndex +
                                    1
                                }`}
                            />

                            {validPhotos.length >
                                1 && (
                                    <button
                                        type="button"
                                        className="photo-gallery-arrow photo-gallery-arrow-right"
                                        onClick={
                                            showNext
                                        }
                                        aria-label="Next photo"
                                    >
                                        ›
                                    </button>
                                )}
                        </div>

                        {/* THUMBNAILS */}

                        {validPhotos.length >
                            1 && (
                                <div className="photo-gallery-thumbnails">
                                    {validPhotos.map(
                                        (
                                            photo,
                                            index
                                        ) => (
                                            <button
                                                type="button"
                                                key={`${photo}-${index}`}
                                                className={
                                                    index ===
                                                    selectedIndex
                                                        ? "photo-gallery-thumbnail active"
                                                        : "photo-gallery-thumbnail"
                                                }
                                                onClick={() =>
                                                    setSelectedIndex(
                                                        index
                                                    )
                                                }
                                                aria-label={`Photo ${
                                                    index +
                                                    1
                                                }`}
                                            >
                                                <img
                                                    src={
                                                        photo
                                                    }
                                                    alt=""
                                                />
                                            </button>
                                        )
                                    )}
                                </div>
                            )}
                    </div>
                </div>,
                document.body
            )
            : null;

    return (
        <>
            <div className="stay-gallery">
                {/* HOTEL */}

                <button
                    type="button"
                    className="gallery-main gallery-clickable"
                    onClick={() =>
                        openGallery(0)
                    }
                >
                    <img
                        src={galleryPhotos[0]}
                        alt={hotelName}
                    />
                </button>

                {/* ROOM 1 + ROOM 2 */}

                <div className="gallery-small">
                    <button
                        type="button"
                        className="gallery-clickable"
                        onClick={() =>
                            openGallery(
                                roomPhotos[0]
                                    ? 1
                                    : 0
                            )
                        }
                    >
                        <img
                            src={
                                galleryPhotos[1]
                            }
                            alt={`${hotelName} room 1`}
                        />
                    </button>

                    <button
                        type="button"
                        className="gallery-clickable"
                        onClick={() =>
                            openGallery(
                                roomPhotos[1]
                                    ? 2
                                    : 0
                            )
                        }
                    >
                        <img
                            src={
                                galleryPhotos[2]
                            }
                            alt={`${hotelName} room 2`}
                        />
                    </button>
                </div>

                {/* ROOM 3 + ROOM 4 */}

                <div className="gallery-small">
                    <button
                        type="button"
                        className="gallery-clickable"
                        onClick={() =>
                            openGallery(
                                roomPhotos[2]
                                    ? 3
                                    : 0
                            )
                        }
                    >
                        <img
                            src={
                                galleryPhotos[3]
                            }
                            alt={`${hotelName} room 3`}
                        />
                    </button>

                    <button
                        type="button"
                        className="gallery-more"
                        onClick={() =>
                            openGallery(
                                roomPhotos[3]
                                    ? 4
                                    : 0
                            )
                        }
                    >
                        <img
                            src={
                                galleryPhotos[4]
                            }
                            alt={`${hotelName} room 4`}
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

            {modal}
        </>
    );
}