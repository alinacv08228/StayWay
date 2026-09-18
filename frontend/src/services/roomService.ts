import api from "../lib/api";
import { Room } from "../types/types";

/* =========================================================
   BACKEND API
========================================================= */

export async function getRoomsFromApi(): Promise<Room[]> {
    const response =
        await api.get<Room[]>(
            "/api/Rooms"
        );

    return response.data;
}

export async function getRoomsByPropertyIdFromApi(
    propertyId: number
): Promise<Room[]> {
    const response =
        await api.get<Room[]>(
            `/api/Rooms/property/${propertyId}`
        );

    return response.data;
}

export async function createRoomInApi(
    room: Omit<Room, "id">
): Promise<Room> {
    const response =
        await api.post<Room>(
            "/api/Rooms",
            {
                id: 0,
                ...room,
            }
        );

    return response.data;
}

export async function updateRoomInApi(
    roomId: number,
    data: Omit<Room, "id">
): Promise<Room> {
    const response =
        await api.put<Room>(
            `/api/Rooms/${roomId}`,
            {
                id: roomId,
                ...data,
            }
        );

    return response.data;
}

export async function deleteRoomInApi(
    roomId: number
): Promise<void> {
    await api.delete(
        `/api/Rooms/${roomId}`
    );
}
