import {
    reviews as mockReviews,
    properties as mockProperties,
} from "../data/mockData";

import {
    Review,
    Property,
} from "../types/types";

const REVIEWS_KEY = "stayway_reviews";
const PROPERTIES_KEY = "stayway_properties";

/* =========================================================
   MOCK REVIEW DATA
   ========================================================= */

const mockReviewers = [
    "Sophie",
    "Daniel",
    "Emma",
    "Olivia",
    "Lucas",
    "Amelia",
    "Noah",
    "Charlotte",
    "James",
    "Mia",
];

const reviewTemplates = [
    {
        rating: 5,
        text: (hotelName: string) =>
            `Wonderful stay at ${hotelName}. The room was beautiful, clean and very comfortable. The location was excellent and everything felt well organised.`,
    },
    {
        rating: 4,
        text: (hotelName: string) =>
            `We really enjoyed our stay at ${hotelName}. The hotel has a lovely atmosphere, friendly service and everything we needed for a comfortable trip.`,
    },
    {
        rating: 5,
        text: (hotelName: string) =>
            `Excellent experience at ${hotelName}. The accommodation was comfortable, the room was very pleasant and the location made exploring the city easy.`,
    },
    {
        rating: 4,
        text: (hotelName: string) =>
            `A very pleasant stay at ${hotelName}. Everything was clean and comfortable, and the overall experience was excellent.`,
    },
];

/* =========================================================
   MOCK REVIEW DATES
   =========================================================
   Different dates are used so artificial reviews do not all
   appear to have been written on the 15th.
   ========================================================= */

const mockReviewDates = [
    "2026-08-08",
    "2026-08-11",
    "2026-08-14",
    "2026-08-18",
    "2026-08-21",
    "2026-08-24",
    "2026-08-27",
    "2026-08-30",
    "2026-09-01",
    "2026-09-03",
];

/* =========================================================
   HELPERS
   ========================================================= */

function getPropertiesForReviews(): Property[] {
    if (typeof window === "undefined") {
        return mockProperties;
    }

    const savedProperties =
        localStorage.getItem(PROPERTIES_KEY);

    if (!savedProperties) {
        return mockProperties;
    }

    try {
        return JSON.parse(
            savedProperties
        ) as Property[];
    } catch {
        return mockProperties;
    }
}

function getNextReviewId(
    reviews: Review[]
): number {
    if (reviews.length === 0) {
        return 1;
    }

    return (
        Math.max(
            ...reviews.map(
                (review) => review.id
            )
        ) + 1
    );
}

/* =========================================================
   GET MOCK DATE
   ========================================================= */

function getMockReviewDate(
    propertyId: number,
    reviewIndex: number
): string {
    const index =
        (propertyId * 3 + reviewIndex) %
        mockReviewDates.length;

    return mockReviewDates[index];
}

/* =========================================================
   GENERATE MOCK REVIEWS
   ========================================================= */

function generateMockReviewsForProperty(
    property: Property,
    startingId: number
): Review[] {
    return reviewTemplates
        .slice(0, 3)
        .map((template, index) => ({
            id: startingId + index,

            propertyId:
            property.id,

            userId:
                1000 +
                property.id * 10 +
                index,

            userName:
                mockReviewers[
                (property.id + index) %
                mockReviewers.length
                    ],

            rating:
            template.rating,

            comment:
                template.text(
                    property.name
                ),

            createdAt:
                getMockReviewDate(
                    property.id,
                    index
                ),

            isMock: true,
        }));
}

/* =========================================================
   NORMALIZE OLD REVIEWS
   =========================================================
   Reviews already saved in localStorage may contain the old
   artificial date "15". We replace dates ONLY for mock
   reviews. User reviews keep their real creation date.
   ========================================================= */

function normalizeReviews(
    reviews: Review[]
): Review[] {
    return reviews.map(
        (review) => {
            const normalizedReview = {
                ...review,

                isMock:
                    review.isMock ??
                    true,
            };

            /*
             * Artificial reviews created by the old version
             * used dates ending in "-15".
             *
             * Give them different realistic dates.
             */
            if (
                normalizedReview.isMock
            ) {
                const currentDate =
                    normalizedReview.createdAt;

                if (
                    !currentDate ||
                    currentDate.endsWith(
                        "-15"
                    ) ||
                    currentDate ===
                    "2026-01-15"
                ) {
                    normalizedReview.createdAt =
                        getMockReviewDate(
                            review.propertyId,
                            review.id % 3
                        );
                }
            }

            /*
             * User reviews should have a date.
             * This fallback is only for very old data.
             */
            if (
                !normalizedReview.createdAt
            ) {
                normalizedReview.createdAt =
                    new Date().toISOString();
            }
            if (
                normalizedReview.isMock &&
                normalizedReview.rating === 4.5
            ) {
                normalizedReview.rating = 4;
            }
            
            return normalizedReview;
        }
    );
}

/* =========================================================
   INITIAL REVIEWS
   ========================================================= */

function getInitialReviews(): Review[] {
    const allProperties =
        mockProperties;

    const initialReviews: Review[] =
        mockReviews.map(
            (review) => ({
                ...review,

                userId:
                    review.userId ??
                    1000 +
                    review.id,

                isMock: true,

                createdAt:
                    review.createdAt &&
                    !review.createdAt.endsWith(
                        "-15"
                    )
                        ? review.createdAt
                        : getMockReviewDate(
                            review.propertyId,
                            review.id % 3
                        ),
            })
        );

    let nextId =
        getNextReviewId(
            initialReviews
        );

    for (const property of allProperties) {
        const hasReviews =
            initialReviews.some(
                (review) =>
                    review.propertyId ===
                    property.id
            );

        if (!hasReviews) {
            const generatedReviews =
                generateMockReviewsForProperty(
                    property,
                    nextId
                );

            initialReviews.push(
                ...generatedReviews
            );

            nextId +=
                generatedReviews.length;
        }
    }

    return initialReviews;
}

/* =========================================================
   GET ALL REVIEWS
   ========================================================= */

export function getReviews(): Review[] {
    if (
        typeof window === "undefined"
    ) {
        return getInitialReviews();
    }

    const savedReviews =
        localStorage.getItem(
            REVIEWS_KEY
        );

    if (!savedReviews) {
        const initialReviews =
            getInitialReviews();

        localStorage.setItem(
            REVIEWS_KEY,
            JSON.stringify(
                initialReviews
            )
        );

        return initialReviews;
    }

    try {
        let parsedReviews =
            JSON.parse(
                savedReviews
            ) as Review[];

        /*
         * Fix old reviews created by
         * previous versions of the service.
         */
        parsedReviews =
            normalizeReviews(
                parsedReviews
            );

        /*
         * Check all current properties.
         *
         * This includes properties created
         * later by Admin.
         */
        const allProperties =
            getPropertiesForReviews();

        let nextId =
            getNextReviewId(
                parsedReviews
            );

        for (const property of allProperties) {
            const hasReviews =
                parsedReviews.some(
                    (review) =>
                        review.propertyId ===
                        property.id
                );

            /*
             * If a hotel has no reviews,
             * automatically create artificial
             * reviews for it.
             */
            if (!hasReviews) {
                const generatedReviews =
                    generateMockReviewsForProperty(
                        property,
                        nextId
                    );

                parsedReviews.push(
                    ...generatedReviews
                );

                nextId +=
                    generatedReviews.length;
            }
        }

        localStorage.setItem(
            REVIEWS_KEY,
            JSON.stringify(
                parsedReviews
            )
        );

        return parsedReviews;
    } catch {
        const initialReviews =
            getInitialReviews();

        localStorage.setItem(
            REVIEWS_KEY,
            JSON.stringify(
                initialReviews
            )
        );

        return initialReviews;
    }
}

/* =========================================================
   SAVE
   ========================================================= */

function saveReviews(
    reviews: Review[]
): void {
    if (
        typeof window === "undefined"
    ) {
        return;
    }

    localStorage.setItem(
        REVIEWS_KEY,
        JSON.stringify(reviews)
    );
}

/* =========================================================
   GET REVIEWS BY PROPERTY
   ========================================================= */

export function getReviewsByPropertyId(
    propertyId: number
): Review[] {
    return getReviews().filter(
        (review) =>
            review.propertyId ===
            propertyId
    );
}

/* =========================================================
   CREATE USER REVIEW
   ========================================================= */

export function createReview(
    reviewData: Omit<
        Review,
        "id"
    >
): Review {
    const currentReviews =
        getReviews();

    const newReview: Review = {
        ...reviewData,

        id:
            getNextReviewId(
                currentReviews
            ),

        isMock: false,

        /*
         * User review receives the
         * actual current date/time.
         */
        createdAt:
            new Date().toISOString(),
    };

    saveReviews([
        ...currentReviews,
        newReview,
    ]);

    return newReview;
}

/* =========================================================
   DELETE USER REVIEW
   ========================================================= */

export function deleteReview(
    reviewId: number,
    userId: number
): boolean {
    const currentReviews =
        getReviews();

    const review =
        currentReviews.find(
            (item) =>
                item.id === reviewId
        );

    if (!review) {
        return false;
    }

    /*
     * Artificial reviews cannot be deleted.
     */
    if (review.isMock) {
        return false;
    }

    /*
     * A user can delete ONLY
     * their own review.
     */
    if (
        review.userId !== userId
    ) {
        return false;
    }

    const updatedReviews =
        currentReviews.filter(
            (item) =>
                item.id !== reviewId
        );

    saveReviews(
        updatedReviews
    );

    return true;
}

/* =========================================================
   AVERAGE RATING
   ========================================================= */

export function getAverageRating(
    propertyId: number
): number {
    const propertyReviews =
        getReviewsByPropertyId(
            propertyId
        );

    if (
        propertyReviews.length === 0
    ) {
        return 0;
    }

    const total =
        propertyReviews.reduce(
            (sum, review) =>
                sum + review.rating,
            0
        );

    return Number(
        (
            total /
            propertyReviews.length
        ).toFixed(1)
    );
}