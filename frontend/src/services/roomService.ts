import { rooms as mockRooms } from "../data/mockData";
import { Room } from "../types/types";

const ROOMS_KEY = "stayway_rooms";

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
    localStorage.setItem(
        ROOMS_KEY,
        JSON.stringify(rooms)
    );
}

export function getRoomsByPropertyId(
    propertyId: number
): Room[] {
    return getRooms().filter(
        (room) =>
            room.propertyId === propertyId
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