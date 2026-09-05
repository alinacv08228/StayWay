"use client";

import { useEffect, useMemo, useState } from "react";

import { useUser } from "../context/UserContext";

import {
    createReview,
    deleteReview,
    getAverageRating,
    getReviewsByPropertyId,
} from "../services/reviewService";

import { Review } from "../types/types";

type ReviewSectionProps = {
    propertyId: number;
    propertyRating: number;
};

export default function ReviewSection({
                                          propertyId,
                                          propertyRating,
                                      }: ReviewSectionProps) {
    const { currentUser } = useUser();

    const [propertyReviews, setPropertyReviews] =
        useState<Review[]>([]);

    const [selectedRating, setSelectedRating] =
        useState(0);

    const [comment, setComment] =
        useState("");

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const [deletingId, setDeletingId] =
        useState<number | null>(null);

    const loadReviews = () => {
        setPropertyReviews(
            getReviewsByPropertyId(propertyId)
        );
    };

    useEffect(() => {
        loadReviews();
    }, [propertyId]);

    const averageRating = useMemo(() => {
        const calculatedRating =
            getAverageRating(propertyId);

        if (calculatedRating > 0) {
            return calculatedRating;
        }

        return propertyRating;
    }, [
        propertyId,
        propertyRating,
        propertyReviews,
    ]);

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!currentUser) {
            setError(
                "You must be logged in to leave a review."
            );

            return;
        }

        if (currentUser.role !== "user") {
            setError(
                "Only users can leave reviews."
            );

            return;
        }

        if (selectedRating === 0) {
            setError(
                "Please select a rating."
            );

            return;
        }

        if (!comment.trim()) {
            setError(
                "Please write a review."
            );

            return;
        }

        if (comment.trim().length < 10) {
            setError(
                "Your review must contain at least 10 characters."
            );

            return;
        }

        setSubmitting(true);

        try {
            createReview({
                propertyId,
                userId: currentUser.id,
                userName: currentUser.name,
                rating: selectedRating,
                comment: comment.trim(),
                isMock: false,
            });

            setComment("");
            setSelectedRating(0);

            loadReviews();

            setSuccess(
                "Your review has been added successfully! ⭐"
            );
        } catch {
            setError(
                "Something went wrong while adding your review."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (
        reviewId: number
    ) => {
        if (!currentUser) {
            return;
        }

        if (currentUser.role !== "user") {
            return;
        }

        const confirmed =
            window.confirm(
                "Are you sure you want to delete your review?"
            );

        if (!confirmed) {
            return;
        }

        setDeletingId(reviewId);

        try {
            const deleted =
                deleteReview(
                    reviewId,
                    currentUser.id
                );

            if (!deleted) {
                setError(
                    "You can only delete your own review."
                );

                return;
            }

            loadReviews();

            setSuccess(
                "Your review has been deleted."
            );
        } catch {
            setError(
                "Something went wrong while deleting the review."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (
        date?: string
    ) => {
        if (!date) {
            return "";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "";
        }

        return parsedDate.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );
    };

    return (
        <div className="review-section">

            {/* HEADER */}

            <div className="reviews-title">

                <div>
                    <h2>
                        Guest reviews
                    </h2>

                    <p>
                        See what other guests think
                        about this property.
                    </p>
                </div>

                <div className="review-score">

                    <strong>
                        {averageRating.toFixed(1)}
                    </strong>

                    <span>
                        ★ Excellent
                    </span>

                    <small>
                        {propertyReviews.length}{" "}
                        {propertyReviews.length === 1
                            ? "review"
                            : "reviews"}
                    </small>

                </div>

            </div>


            {/* MESSAGES */}

            {error && (
                <div className="review-message review-message-error">
                    ⚠️ {error}
                </div>
            )}

            {success && (
                <div className="review-message review-message-success">
                    ✓ {success}
                </div>
            )}


            {/* REVIEWS */}

            {propertyReviews.length === 0 ? (
                <div className="review-empty">
                    <div className="review-empty-icon">
                        💬
                    </div>

                    <h3>
                        No reviews yet
                    </h3>

                    <p>
                        Be the first guest to share
                        your experience.
                    </p>
                </div>
            ) : (
                <div className="reviews-list">

                    {propertyReviews.map(
                        (review) => {

                            const isOwnReview =
                                currentUser?.role ===
                                "user" &&
                                !review.isMock &&
                                review.userId ===
                                currentUser.id;

                            return (
                                <article
                                    className="review-card"
                                    key={review.id}
                                >

                                    <div className="review-card-header">

                                        <div className="review-author">

                                            <div className="review-avatar">
                                                {review.userName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>

                                            <div>
                                                <strong>
                                                    {
                                                        review.userName
                                                    }
                                                </strong>

                                                <span>
                                                    {review.isMock
                                                        ? "Verified guest"
                                                        : "Guest review"}
                                                </span>
                                            </div>

                                        </div>

                                        <div className="review-rating">
                                            {"★".repeat(
                                                Math.floor(
                                                    review.rating
                                                )
                                            )}

                                            {review.rating % 1 !==
                                                0 && (
                                                    <span>
                                                    ½
                                                </span>
                                                )}
                                        </div>

                                    </div>


                                    <p className="review-comment">
                                        {review.comment}
                                    </p>


                                    <div className="review-card-footer">

                                        <span>
                                            {formatDate(
                                                review.createdAt
                                            )}
                                        </span>

                                        {isOwnReview && (
                                            <button
                                                type="button"
                                                className="review-delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        review.id
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    review.id
                                                }
                                            >
                                                {deletingId ===
                                                review.id
                                                    ? "Deleting..."
                                                    : "🗑️ Delete"}
                                            </button>
                                        )}

                                    </div>

                                </article>
                            );
                        }
                    )}

                </div>
            )}


            {/* WRITE REVIEW */}

            {currentUser?.role ===
                "user" && (
                    <div className="write-review">

                        <div className="write-review-header">

                            <div>
                                <h3>
                                    ✍️ Write a review
                                </h3>

                                <p>
                                    Share your experience
                                    with other travellers.
                                </p>
                            </div>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="review-form"
                        >

                            <div className="rating-selector">

                                <label>
                                    Your rating
                                </label>

                                <div
                                    className="star-selector"
                                    aria-label="Select rating"
                                >
                                    {[1, 2, 3, 4, 5].map(
                                        (star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={
                                                    star <=
                                                    selectedRating
                                                        ? "star-button selected"
                                                        : "star-button"
                                                }
                                                onClick={() =>
                                                    setSelectedRating(
                                                        star
                                                    )
                                                }
                                                aria-label={`${star} star`}
                                            >
                                                ★
                                            </button>
                                        )
                                    )}
                                </div>

                                {selectedRating > 0 && (
                                    <span className="rating-hint">
                                    {selectedRating === 5
                                        ? "Excellent! ⭐"
                                        : selectedRating === 4
                                            ? "Very good! 😊"
                                            : selectedRating === 3
                                                ? "Good 👍"
                                                : selectedRating === 2
                                                    ? "Could be better."
                                                    : "Poor."}
                                </span>
                                )}

                            </div>


                            <div className="review-input-group">

                                <label htmlFor="review-comment">
                                    Your review
                                </label>

                                <textarea
                                    id="review-comment"
                                    value={comment}
                                    onChange={(event) =>
                                        setComment(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Tell other travellers about your stay..."
                                    rows={5}
                                    maxLength={500}
                                />

                                <div className="review-character-count">
                                    {comment.length}/500
                                </div>

                            </div>


                            <button
                                type="submit"
                                className="review-submit-button"
                                disabled={submitting}
                            >
                                {submitting
                                    ? "Publishing..."
                                    : "Publish review ⭐"}
                            </button>

                        </form>

                    </div>
                )}

        </div>
    );
}