import api from "../lib/api";

export type SupportMessage = {
    id: number;
    userId: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status:
        | "new"
        | "read"
        | "resolved"
        | string;
    createdAt: string;
};

export type CreateSupportMessageInput = {
    subject: string;
    message: string;
};

export async function getSupportMessagesFromApi():
    Promise<SupportMessage[]> {
    const response =
        await api.get<SupportMessage[]>(
            "/api/SupportMessages"
        );

    return response.data;
}

export async function createSupportMessageInApi(
    message: CreateSupportMessageInput
): Promise<SupportMessage> {
    const response =
        await api.post<SupportMessage>(
            "/api/SupportMessages",
            message
        );

    return response.data;
}