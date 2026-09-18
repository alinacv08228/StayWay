import api from "../lib/api";
import { Review } from "../types/types";

/* =========================================================
   BACKEND API TYPES
========================================================= */

type ReviewApiDto = {
    id: number;
    propertyId: number;
    userId: string | null;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
    isMock: boolean;
};

export type ReviewApiInput = {
    propertyId: number;
    userId: string | number;
    userName: string;
    rating: number;
    comment: string;
};

/* =========================================================
   MAPPING
========================================================= */

function mapApiReview(
    review: ReviewApiDto
): Review {
    return {
        id: review.id,
        propertyId: review.propertyId,
        userId:
            review.userId as unknown as
                Review["userId"],
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        isMock: review.isMock,
    };
}

/* =========================================================
   BACKEND API
========================================================= */

export async function getReviewsFromApi():
    Promise<Review[]> {
    const response =
        await api.get<ReviewApiDto[]>(
            "/api/Reviews"
        );

    return response.data.map(
        mapApiReview
    );
}

export async function getReviewByIdFromApi(
    reviewId: number
): Promise<Review> {
    const response =
        await api.get<ReviewApiDto>(
            `/api/Reviews/${reviewId}`
        );

    return mapApiReview(
        response.data
    );
}

export async function getReviewsByPropertyIdFromApi(
    propertyId: number
): Promise<Review[]> {
    const response =
        await api.get<ReviewApiDto[]>(
            `/api/Reviews/property/${propertyId}`
        );

    return response.data.map(
        mapApiReview
    );
}

export async function getAverageRatingFromApi(
    propertyId: number
): Promise<number> {
    const response =
        await api.get<number>(
            `/api/Reviews/property/${propertyId}/average`
        );

    return response.data;
}

export async function createReviewInApi(
    reviewData: ReviewApiInput
): Promise<Review> {
    const response =
        await api.post<ReviewApiDto>(
            "/api/Reviews",
            {
                id: 0,
                propertyId:
                reviewData.propertyId,
                userId:
                    String(
                        reviewData.userId
                    ),
                userName:
                reviewData.userName,
                rating:
                reviewData.rating,
                comment:
                reviewData.comment,
                createdAt: "",
                isMock: false,
            }
        );

    return mapApiReview(
        response.data
    );
}

export async function deleteReviewInApi(
    reviewId: number,
    userId: string | number
): Promise<void> {
    await api.delete(
        `/api/Reviews/${reviewId}`,
        {
            params: {
                userId:
                    String(userId),
            },
        }
    );
}
