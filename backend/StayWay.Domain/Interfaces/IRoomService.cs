using StayWay.Domain.DTOs;

namespace StayWay.Domain.Interfaces;

public interface IRoomService
{
    List<RoomDto> GetAll();
    RoomDto? GetById(int id);
    List<RoomDto> GetByPropertyId(int propertyId);
    RoomDto Create(RoomDto room);
    RoomDto? Update(int id, RoomDto room);
    bool Delete(int id);
}