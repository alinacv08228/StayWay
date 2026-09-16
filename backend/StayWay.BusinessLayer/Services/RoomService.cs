using System.Text.Json;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class RoomService : IRoomService
{
    private readonly string _filePath;
    private readonly List<RoomEntity> _rooms;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };

    public RoomService(string filePath)
    {
        _filePath = filePath;

        var directory = Path.GetDirectoryName(_filePath);

        if (!string.IsNullOrWhiteSpace(directory))
        {
            Directory.CreateDirectory(directory);
        }

        _rooms = LoadRooms();
    }

    public List<RoomDto> GetAll()
    {
        return _rooms
            .Select(ToDto)
            .ToList();
    }

    public RoomDto? GetById(int id)
    {
        var room = _rooms.FirstOrDefault(item => item.Id == id);

        return room is null
            ? null
            : ToDto(room);
    }

    public List<RoomDto> GetByPropertyId(int propertyId)
    {
        return _rooms
            .Where(room => room.PropertyId == propertyId)
            .Select(ToDto)
            .ToList();
    }

    public RoomDto Create(RoomDto room)
    {
        var nextId = _rooms.Count == 0
            ? 1
            : _rooms.Max(item => item.Id) + 1;

        var entity = new RoomEntity
        {
            Id = nextId,
            PropertyId = room.PropertyId,
            Name = room.Name,
            Description = room.Description,
            Guests = room.Guests,
            Size = room.Size,
            Bed = room.Bed,
            PricePerNight = room.PricePerNight,
            Image = room.Image,
            Features = room.Features ?? [],
            FreeCancellation = room.FreeCancellation,
            NoPrepayment = room.NoPrepayment
        };

        _rooms.Add(entity);
        SaveRooms();

        return ToDto(entity);
    }

    public RoomDto? Update(int id, RoomDto room)
    {
        var existing = _rooms.FirstOrDefault(item => item.Id == id);

        if (existing is null)
        {
            return null;
        }

        existing.PropertyId = room.PropertyId;
        existing.Name = room.Name;
        existing.Description = room.Description;
        existing.Guests = room.Guests;
        existing.Size = room.Size;
        existing.Bed = room.Bed;
        existing.PricePerNight = room.PricePerNight;
        existing.Image = room.Image;
        existing.Features = room.Features ?? [];
        existing.FreeCancellation = room.FreeCancellation;
        existing.NoPrepayment = room.NoPrepayment;

        SaveRooms();

        return ToDto(existing);
    }

    public bool Delete(int id)
    {
        var room = _rooms.FirstOrDefault(item => item.Id == id);

        if (room is null)
        {
            return false;
        }

        _rooms.Remove(room);
        SaveRooms();

        return true;
    }

    private List<RoomEntity> LoadRooms()
    {
        if (!File.Exists(_filePath))
        {
            return [];
        }

        try
        {
            var json = File.ReadAllText(_filePath);

            return JsonSerializer.Deserialize<List<RoomEntity>>(
                json,
                JsonOptions
            ) ?? [];
        }
        catch
        {
            return [];
        }
    }

    private void SaveRooms()
    {
        var json = JsonSerializer.Serialize(
            _rooms,
            JsonOptions
        );

        File.WriteAllText(
            _filePath,
            json
        );
    }

    private static RoomDto ToDto(RoomEntity room)
    {
        return new RoomDto
        {
            Id = room.Id,
            PropertyId = room.PropertyId,
            Name = room.Name,
            Description = room.Description,
            Guests = room.Guests,
            Size = room.Size,
            Bed = room.Bed,
            PricePerNight = room.PricePerNight,
            Image = room.Image,
            Features = room.Features ?? [],
            FreeCancellation = room.FreeCancellation,
            NoPrepayment = room.NoPrepayment
        };
    }
}
