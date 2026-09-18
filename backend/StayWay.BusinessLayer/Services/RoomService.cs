using Microsoft.EntityFrameworkCore;
using StayWay.DataAccessLayer.Context;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class RoomService : IRoomService
{
    private readonly AppDbContext _context;

    public RoomService(
        AppDbContext context
    )
    {
        _context = context;
    }

    public List<RoomDto> GetAll()
    {
        return _context.Rooms
            .AsNoTracking()
            .OrderBy(room => room.Id)
            .Select(room =>
                new RoomDto
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
                    Features = room.Features,
                    FreeCancellation = room.FreeCancellation,
                    NoPrepayment = room.NoPrepayment
                }
            )
            .ToList();
    }

    public RoomDto? GetById(
        int id
    )
    {
        var room =
            _context.Rooms
                .AsNoTracking()
                .FirstOrDefault(
                    item => item.Id == id
                );

        return room is null
            ? null
            : ToDto(room);
    }

    public List<RoomDto> GetByPropertyId(
        int propertyId
    )
    {
        return _context.Rooms
            .AsNoTracking()
            .Where(room =>
                room.PropertyId == propertyId
            )
            .OrderBy(room => room.Id)
            .Select(room =>
                new RoomDto
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
                    Features = room.Features,
                    FreeCancellation = room.FreeCancellation,
                    NoPrepayment = room.NoPrepayment
                }
            )
            .ToList();
    }

    public RoomDto Create(
        RoomDto room
    )
    {
        var entity =
            new RoomEntity
            {
                PropertyId = room.PropertyId,
                Name = room.Name,
                Description = room.Description,
                Guests = room.Guests,
                Size = room.Size,
                Bed = room.Bed,
                PricePerNight = room.PricePerNight,
                Image = room.Image,
                Features = room.Features ?? [],
                FreeCancellation =
                    room.FreeCancellation,
                NoPrepayment =
                    room.NoPrepayment
            };

        _context.Rooms.Add(entity);
        _context.SaveChanges();

        return ToDto(entity);
    }

    public RoomDto? Update(
        int id,
        RoomDto room
    )
    {
        var existing =
            _context.Rooms
                .FirstOrDefault(
                    item => item.Id == id
                );

        if (existing is null)
        {
            return null;
        }

        existing.PropertyId =
            room.PropertyId;

        existing.Name =
            room.Name;

        existing.Description =
            room.Description;

        existing.Guests =
            room.Guests;

        existing.Size =
            room.Size;

        existing.Bed =
            room.Bed;

        existing.PricePerNight =
            room.PricePerNight;

        existing.Image =
            room.Image;

        existing.Features =
            room.Features ?? [];

        existing.FreeCancellation =
            room.FreeCancellation;

        existing.NoPrepayment =
            room.NoPrepayment;

        _context.SaveChanges();

        return ToDto(existing);
    }

    public bool Delete(
        int id
    )
    {
        var room =
            _context.Rooms
                .FirstOrDefault(
                    item => item.Id == id
                );

        if (room is null)
        {
            return false;
        }

        _context.Rooms.Remove(room);
        _context.SaveChanges();

        return true;
    }

    private static RoomDto ToDto(
        RoomEntity room
    )
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
            FreeCancellation =
                room.FreeCancellation,
            NoPrepayment =
                room.NoPrepayment
        };
    }
}
