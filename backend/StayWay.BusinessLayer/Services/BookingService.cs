using System.Text.Json;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class BookingService : IBookingService
{
    private readonly string _filePath;

    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };

    public BookingService(string filePath)
    {
        _filePath = filePath;
    }

    public List<BookingDto> GetAll()
    {
        return LoadBookings()
            .Select(ToDto)
            .ToList();
    }

    public BookingDto? GetById(long id)
    {
        var booking = LoadBookings()
            .FirstOrDefault(item => item.Id == id);

        return booking is null
            ? null
            : ToDto(booking);
    }

    public List<BookingDto> GetByUserId(string userId)
    {
        return LoadBookings()
            .Where(item => item.UserId == userId)
            .Select(ToDto)
            .ToList();
    }

    public BookingDto Create(BookingDto booking)
    {
        var bookings = LoadBookings();

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

        var nextId = bookings.Count == 0
            ? DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            : Math.Max(
                DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                bookings.Max(item => item.Id) + 1
            );

        var entity = new BookingEntity
        {
            Id = nextId,
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
            Status = string.IsNullOrWhiteSpace(booking.Status)
                ? "pending"
                : booking.Status,
            FirstName = booking.FirstName,
            LastName = booking.LastName,
            Email = booking.Email,
            Phone = booking.Phone,
            SpecialRequests = booking.SpecialRequests
        };

        bookings.Add(entity);
        SaveBookings(bookings);

        return ToDto(entity);
    }

    public BookingDto? Update(long id, BookingDto booking)
    {
        var bookings = LoadBookings();

        var existing = bookings
            .FirstOrDefault(item => item.Id == id);

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

        existing.UserId = booking.UserId;
        existing.PropertyId = booking.PropertyId;
        existing.RoomId = booking.RoomId;
        existing.CheckIn = booking.CheckIn;
        existing.CheckOut = booking.CheckOut;
        existing.Adults = booking.Adults;
        existing.Children = booking.Children;
        existing.Infants = booking.Infants;
        existing.Guests = booking.Guests;
        existing.TotalPrice = booking.TotalPrice;
        existing.Status = booking.Status;
        existing.FirstName = booking.FirstName;
        existing.LastName = booking.LastName;
        existing.Email = booking.Email;
        existing.Phone = booking.Phone;
        existing.SpecialRequests = booking.SpecialRequests;

        SaveBookings(bookings);

        return ToDto(existing);
    }

    public bool Delete(long id)
    {
        var bookings = LoadBookings();

        var booking = bookings
            .FirstOrDefault(item => item.Id == id);

        if (booking is null)
        {
            return false;
        }

        bookings.Remove(booking);
        SaveBookings(bookings);

        return true;
    }

    public bool IsRoomAvailable(
        int propertyId,
        int roomId,
        string checkIn,
        string checkOut,
        long? excludeBookingId = null)
    {
        if (!DateOnly.TryParse(checkIn, out var requestedCheckIn) ||
            !DateOnly.TryParse(checkOut, out var requestedCheckOut))
        {
            return false;
        }

        if (requestedCheckOut <= requestedCheckIn)
        {
            return false;
        }

        return !LoadBookings().Any(booking =>
        {
            if (booking.Id == excludeBookingId)
            {
                return false;
            }

            if (booking.Status == "cancelled")
            {
                return false;
            }

            if (booking.PropertyId != propertyId ||
                booking.RoomId != roomId)
            {
                return false;
            }

            if (!DateOnly.TryParse(
                    booking.CheckIn,
                    out var existingCheckIn) ||
                !DateOnly.TryParse(
                    booking.CheckOut,
                    out var existingCheckOut))
            {
                return false;
            }

            return existingCheckIn < requestedCheckOut &&
                   existingCheckOut > requestedCheckIn;
        });
    }

    private List<BookingEntity> LoadBookings()
    {
        if (!File.Exists(_filePath))
        {
            return new List<BookingEntity>();
        }

        var json = File.ReadAllText(_filePath);

        if (string.IsNullOrWhiteSpace(json))
        {
            return new List<BookingEntity>();
        }

        return JsonSerializer.Deserialize<List<BookingEntity>>(
                   json,
                   _jsonOptions
               )
               ?? new List<BookingEntity>();
    }

    private void SaveBookings(List<BookingEntity> bookings)
    {
        var directory = Path.GetDirectoryName(_filePath);

        if (!string.IsNullOrWhiteSpace(directory))
        {
            Directory.CreateDirectory(directory);
        }

        var json = JsonSerializer.Serialize(
            bookings,
            _jsonOptions
        );

        File.WriteAllText(_filePath, json);
    }

    private static BookingDto ToDto(BookingEntity booking)
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
            SpecialRequests = booking.SpecialRequests
        };
    }
}