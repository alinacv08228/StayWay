using Microsoft.EntityFrameworkCore;
using StayWay.DataAccessLayer.Context;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class BookingService : IBookingService
{
    private readonly AppDbContext _context;

    public BookingService(
        AppDbContext context
    )
    {
        _context = context;
    }

    public List<BookingDto> GetAll()
    {
        return _context.Bookings
            .AsNoTracking()
            .OrderBy(booking => booking.Id)
            .Select(booking =>
                new BookingDto
                {
                    Id = booking.Id,
                    UserId = booking.UserId,
                    PropertyId = booking.PropertyId,
                    RoomId = booking.RoomId,
                    CheckIn = booking.CheckIn,
                    CheckOut = booking.CheckOut,
                    Adults = booking.Adults,
                    Children = booking.Children,
                    Infants = booking.Infants,
                    Guests = booking.Guests,
                    TotalPrice = booking.TotalPrice,
                    Status = booking.Status,
                    FirstName = booking.FirstName,
                    LastName = booking.LastName,
                    Email = booking.Email,
                    Phone = booking.Phone,
                    SpecialRequests =
                        booking.SpecialRequests
                }
            )
            .ToList();
    }

    public BookingDto? GetById(
        long id
    )
    {
        var booking =
            _context.Bookings
                .AsNoTracking()
                .FirstOrDefault(
                    item => item.Id == id
                );

        return booking is null
            ? null
            : ToDto(booking);
    }

    public List<BookingDto> GetByUserId(
        string userId
    )
    {
        return _context.Bookings
            .AsNoTracking()
            .Where(booking =>
                booking.UserId == userId
            )
            .OrderBy(booking => booking.Id)
            .Select(booking =>
                new BookingDto
                {
                    Id = booking.Id,
                    UserId = booking.UserId,
                    PropertyId = booking.PropertyId,
                    RoomId = booking.RoomId,
                    CheckIn = booking.CheckIn,
                    CheckOut = booking.CheckOut,
                    Adults = booking.Adults,
                    Children = booking.Children,
                    Infants = booking.Infants,
                    Guests = booking.Guests,
                    TotalPrice = booking.TotalPrice,
                    Status = booking.Status,
                    FirstName = booking.FirstName,
                    LastName = booking.LastName,
                    Email = booking.Email,
                    Phone = booking.Phone,
                    SpecialRequests =
                        booking.SpecialRequests
                }
            )
            .ToList();
    }

    public BookingDto Create(
        BookingDto booking
    )
    {
        if (booking.RoomId.HasValue &&
            !IsRoomAvailable(
                booking.PropertyId,
                booking.RoomId.Value,
                booking.CheckIn,
                booking.CheckOut))
        {
            throw new InvalidOperationException(
                "This room is already booked for the selected dates."
            );
        }

        var entity =
            new BookingEntity
            {
                UserId = booking.UserId,
                PropertyId = booking.PropertyId,
                RoomId = booking.RoomId,
                CheckIn = booking.CheckIn,
                CheckOut = booking.CheckOut,
                Adults = booking.Adults,
                Children = booking.Children,
                Infants = booking.Infants,
                Guests = booking.Guests,
                TotalPrice = booking.TotalPrice,
                Status =
                    string.IsNullOrWhiteSpace(
                        booking.Status
                    )
                        ? "pending"
                        : booking.Status,
                FirstName = booking.FirstName,
                LastName = booking.LastName,
                Email = booking.Email,
                Phone = booking.Phone,
                SpecialRequests =
                    booking.SpecialRequests
            };

        _context.Bookings.Add(entity);
        _context.SaveChanges();

        return ToDto(entity);
    }

    public BookingDto? Update(
        long id,
        BookingDto booking
    )
    {
        var existing =
            _context.Bookings
                .FirstOrDefault(
                    item => item.Id == id
                );

        if (existing is null)
        {
            return null;
        }

        if (booking.RoomId.HasValue &&
            !IsRoomAvailable(
                booking.PropertyId,
                booking.RoomId.Value,
                booking.CheckIn,
                booking.CheckOut,
                id))
        {
            throw new InvalidOperationException(
                "This room is already booked for the selected dates."
            );
        }

        existing.UserId =
            booking.UserId;

        existing.PropertyId =
            booking.PropertyId;

        existing.RoomId =
            booking.RoomId;

        existing.CheckIn =
            booking.CheckIn;

        existing.CheckOut =
            booking.CheckOut;

        existing.Adults =
            booking.Adults;

        existing.Children =
            booking.Children;

        existing.Infants =
            booking.Infants;

        existing.Guests =
            booking.Guests;

        existing.TotalPrice =
            booking.TotalPrice;

        existing.Status =
            booking.Status;

        existing.FirstName =
            booking.FirstName;

        existing.LastName =
            booking.LastName;

        existing.Email =
            booking.Email;

        existing.Phone =
            booking.Phone;

        existing.SpecialRequests =
            booking.SpecialRequests;

        _context.SaveChanges();

        return ToDto(existing);
    }

    public bool Delete(
        long id
    )
    {
        var booking =
            _context.Bookings
                .FirstOrDefault(
                    item => item.Id == id
                );

        if (booking is null)
        {
            return false;
        }

        _context.Bookings.Remove(booking);
        _context.SaveChanges();

        return true;
    }

    public bool IsRoomAvailable(
        int propertyId,
        int roomId,
        string checkIn,
        string checkOut,
        long? excludeBookingId = null
    )
    {
        if (!DateOnly.TryParse(
                checkIn,
                out var requestedCheckIn
            ) ||
            !DateOnly.TryParse(
                checkOut,
                out var requestedCheckOut
            ))
        {
            return false;
        }

        if (requestedCheckOut <= requestedCheckIn)
        {
            return false;
        }

        var bookings =
            _context.Bookings
                .AsNoTracking()
                .Where(booking =>
                    booking.PropertyId == propertyId &&
                    booking.RoomId == roomId &&
                    booking.Status != "cancelled"
                )
                .ToList();

        foreach (var booking in bookings)
        {
            if (excludeBookingId.HasValue &&
                booking.Id ==
                excludeBookingId.Value)
            {
                continue;
            }

            if (!DateOnly.TryParse(
                    booking.CheckIn,
                    out var existingCheckIn
                ) ||
                !DateOnly.TryParse(
                    booking.CheckOut,
                    out var existingCheckOut
                ))
            {
                continue;
            }

            var overlaps =
                existingCheckIn < requestedCheckOut &&
                existingCheckOut > requestedCheckIn;

            if (overlaps)
            {
                return false;
            }
        }

        return true;
    }

    private static BookingDto ToDto(
        BookingEntity booking
    )
    {
        return new BookingDto
        {
            Id = booking.Id,
            UserId = booking.UserId,
            PropertyId = booking.PropertyId,
            RoomId = booking.RoomId,
            CheckIn = booking.CheckIn,
            CheckOut = booking.CheckOut,
            Adults = booking.Adults,
            Children = booking.Children,
            Infants = booking.Infants,
            Guests = booking.Guests,
            TotalPrice = booking.TotalPrice,
            Status = booking.Status,
            FirstName = booking.FirstName,
            LastName = booking.LastName,
            Email = booking.Email,
            Phone = booking.Phone,
            SpecialRequests =
                booking.SpecialRequests
        };
    }
}
