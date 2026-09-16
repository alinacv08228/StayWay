import api from "../lib/api";
import { rooms as mockRooms, properties as mockProperties } from "../data/mockData";
import { Room } from "../types/types";

const ROOMS_KEY = "stayway_rooms";

/* =========================================================
   BACKEND API
   ========================================================= */

export async function getRoomsFromApi(): Promise<Room[]> {
    const response =
        await api.get<Room[]>(
            "/api/Rooms"
        );

    const rooms =
        response.data;

    saveRooms(rooms);

    return rooms;
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

    await getRoomsFromApi();

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

    await getRoomsFromApi();

    return response.data;
}

export async function deleteRoomInApi(
    roomId: number
): Promise<void> {
    await api.delete(
        `/api/Rooms/${roomId}`
    );

    await getRoomsFromApi();
}

/* =========================================================
   LEGACY LOCAL FALLBACK
   ========================================================= */

function getNextRoomId(rooms: Room[]): number {
    if (rooms.length === 0) {
        return 1;
    }

    return (
        Math.max(
            ...rooms.map((room) => room.id)
        ) + 1
    );
}

export function getRooms(): Room[] {
    if (typeof window === "undefined") {
        return mockRooms;
    }

    const saved =
        localStorage.getItem(ROOMS_KEY);

    if (!saved) {
        const initialRooms =
            mockRooms.map((room) => ({
                ...room,
                freeCancellation:
                    room.freeCancellation ??
                    true,
                noPrepayment:
                    room.noPrepayment ??
                    true,
            }));

        localStorage.setItem(
            ROOMS_KEY,
            JSON.stringify(initialRooms)
        );

        return initialRooms;
    }

    try {
        const parsed =
            JSON.parse(saved) as Room[];

        return parsed.map((room) => ({
            ...room,

            freeCancellation:
                room.freeCancellation ??
                true,

            noPrepayment:
                room.noPrepayment ??
                true,

            features:
                room.features ?? [],
        }));
    } catch {
        const initialRooms =
            mockRooms.map((room) => ({
                ...room,

                freeCancellation:
                    room.freeCancellation ??
                    true,

                noPrepayment:
                    room.noPrepayment ??
                    true,
            }));

        localStorage.setItem(
            ROOMS_KEY,
            JSON.stringify(initialRooms)
        );

        return initialRooms;
    }
}

export function saveRooms(
    rooms: Room[]
): void {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(
        ROOMS_KEY,
        JSON.stringify(rooms)
    );
}

export function getRoomsByPropertyId(
    propertyId: number
): Room[] {
    const isMockProperty =
        mockProperties.some(
            (property) =>
                property.id === propertyId
        );

    return getRooms().filter(
        (room) => {
            if (
                room.propertyId !==
                propertyId
            ) {
                return false;
            }

            if (isMockProperty) {
                return true;
            }

            const isMockRoom =
                mockRooms.some(
                    (mockRoom) =>
                        mockRoom.id ===
                        room.id &&
                        mockRoom.propertyId ===
                        room.propertyId
                );

            return !isMockRoom;
        }
    );
}

export function createRoom(
    room: Omit<Room, "id">
): Room {
    const rooms = getRooms();

    const newRoom: Room = {
        ...room,
        id: getNextRoomId(rooms),
    };

    saveRooms([
        ...rooms,
        newRoom,
    ]);

    return newRoom;
}

export function updateRoom(
    roomId: number,
    data: Omit<Room, "id">
): Room {
    const rooms = getRooms();

    const updatedRoom: Room = {
        ...data,
        id: roomId,
    };

    const updatedRooms =
        rooms.map((room) =>
            room.id === roomId
                ? updatedRoom
                : room
        );

    saveRooms(updatedRooms);

    return updatedRoom;
}

export function deleteRoom(
    roomId: number
): void {
    const rooms = getRooms();

    saveRooms(
        rooms.filter(
            (room) =>
                room.id !== roomId
        )
    );
}
