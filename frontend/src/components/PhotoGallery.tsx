"use client";

import { useState } from "react";

type PhotoGalleryProps = {
    photos: string[];
    hotelName: string;
};

export default function PhotoGallery({
                                         photos,
                                         hotelName,
                                     }: PhotoGalleryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(0);

    const openPhoto = (index: number) => {
        setSelectedPhoto(index);
        setIsOpen(true);
    };

    const closePhoto = () => {
        setIsOpen(false);
    };

    const previousPhoto = () => {
        setSelectedPhoto((current) =>
            current === 0 ? photos.length - 1 : current - 1
        );
    };

    const nextPhoto = () => {
        setSelectedPhoto((current) =>
            current === photos.length - 1 ? 0 : current + 1
        );
    };

    const visiblePhotos = photos.slice(0, 5);

    return (
        <>
            <div className="stay-gallery">
                {/* MAIN PHOTO */}
                <div
                    className="gallery-main gallery-clickable"
                    onClick={() => openPhoto(0)}
                >
                    <img
                        src={photos[0]}
                        alt={`${hotelName} main photo`}
                    />
                </div>

                {/* SECOND COLUMN */}
                <div className="gallery-small">
                    {visiblePhotos[1] && (
                        <img
                            src={visiblePhotos[1]}
                            alt={`${hotelName} photo 2`}
                            onClick={() => openPhoto(1)}
                            className="gallery-clickable"
                        />
                    )}

                    {visiblePhotos[2] && (
                        <img
                            src={visiblePhotos[2]}
                            alt={`${hotelName} photo 3`}
                            onClick={() => openPhoto(2)}
                            className="gallery-clickable"
                        />
                    )}
                </div>

                {/* THIRD COLUMN */}
                <div className="gallery-small">
                    {visiblePhotos[3] && (
                        <img
                            src={visiblePhotos[3]}
                            alt={`${hotelName} photo 4`}
                            onClick={() => openPhoto(3)}
                            className="gallery-clickable"
                        />
                    )}

                    <button
                        type="button"
                        className="gallery-more"
                        onClick={() => openPhoto(4)}
                    >
                        {visiblePhotos[4] && (
                            <img
                                src={visiblePhotos[4]}
                                alt={`${hotelName} photo 5`}
                            />
                        )}

                        <span>
                            View all photos
                        </span>
                    </button>
                </div>
            </div>

            {/* ALL PHOTOS */}
            {isOpen && (
                <div
                    className="photo-modal"
                    onClick={closePhoto}
                >
                    <div
                        className="photo-modal-content"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="photo-modal-header">
                            <h2>
                                {hotelName} — Photos
                            </h2>

                            <button
                                type="button"
                                className="photo-modal-close"
                                onClick={closePhoto}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        {/* LARGE PHOTO */}
                        <div className="photo-viewer">
                            <button
                                type="button"
                                className="photo-arrow photo-arrow-left"
                                onClick={previousPhoto}
                                aria-label="Previous photo"
                            >
                                ‹
                            </button>

                            <img
                                src={photos[selectedPhoto]}
                                alt={`${hotelName} photo ${
                                    selectedPhoto + 1
                                }`}
                                className="photo-viewer-image"
                            />

                            <button
                                type="button"
                                className="photo-arrow photo-arrow-right"
                                onClick={nextPhoto}
                                aria-label="Next photo"
                            >
                                ›
                            </button>
                        </div>

                        {/* COUNTER */}
                        <div className="photo-counter">
                            {selectedPhoto + 1} / {photos.length}
                        </div>

                        {/* THUMBNAILS */}
                        <div className="photo-thumbnails">
                            {photos.map((photo, index) => (
                                <button
                                    type="button"
                                    key={`${photo}-${index}`}
                                    className={`photo-thumbnail ${
                                        selectedPhoto === index
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedPhoto(index)
                                    }
                                >
                                    <img
                                        src={photo}
                                        alt={`${hotelName} thumbnail ${
                                            index + 1
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}