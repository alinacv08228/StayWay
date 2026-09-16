import { AxiosInstance } from "axios";

export interface HealthResponse {
    status: string;
    message: string;
}

export async function getHealth(
    api: AxiosInstance
): Promise<HealthResponse> {
    const response =
        await api.get<HealthResponse>(
            "/api/Health"
        );

    return response.data;
}