using System.Text.Json;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class TransferBookingService : ITransferBookingService
{
    private readonly string _dataPath;

    private readonly JsonSerializerOptions _jsonOptions =
        new()
        {
            PropertyNamingPolicy =
                JsonNamingPolicy.CamelCase,

            PropertyNameCaseInsensitive = true,

            WriteIndented = true
        };

    public TransferBookingService(
        string dataPath
    )
    {
        _dataPath = dataPath;
    }

    public List<TransferBookingDto> GetAll()
    {
        return LoadBookings()
            .OrderByDescending(
                booking => booking.CreatedAt
            )
            .Select(ToDto)
            .ToList();
    }

    public TransferBookingDto? GetById(
        string id
    )
    {
        var booking = LoadBookings()
            .FirstOrDefault(
                item =>
                    item.Id.Equals(
                        id,
                        StringComparison.OrdinalIgnoreCase
                    )
            );

        return booking is null
            ? null
            : ToDto(booking);
    }

    public List<TransferBookingDto> GetByDriverId(
        string driverId
    )
    {
        return LoadBookings()
            .Where(
                booking =>
                    booking.DriverId != null &&
                    booking.DriverId.Equals(
                        driverId,
                        StringComparison.OrdinalIgnoreCase
                    )
            )
            .OrderByDescending(
                booking => booking.CreatedAt
            )
            .Select(ToDto)
            .ToList();
    }

    public TransferBookingDto Create(
        TransferBookingDto booking
    )
    {
        var bookings = LoadBookings();

        var newBooking =
            new TransferBookingEntity
            {
                Id = string.IsNullOrWhiteSpace(
                    booking.Id
                )
                    ? $"transfer-booking-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}"
                    : booking.Id,

                TransferType =
                    booking.TransferType,

                OptionId =
                    booking.OptionId,

                OptionTitle =
                    booking.OptionTitle,

                Price =
                    booking.Price,

                VehicleId =
                    booking.VehicleId,

                VehicleName =
                    booking.VehicleName,

                LicensePlate =
                    booking.LicensePlate,

                DriverId =
                    booking.DriverId,

                DriverName =
                    booking.DriverName,

                Pickup =
                    booking.Pickup,

                Destination =
                    booking.Destination,

                Date =
                    booking.Date,

                Time =
                    booking.Time,

                Passengers =
                    booking.Passengers,

                ReturnDate =
                    booking.ReturnDate,

                ReturnTime =
                    booking.ReturnTime,

                FirstName =
                    booking.FirstName,

                LastName =
                    booking.LastName,

                Email =
                    booking.Email,

                Phone =
                    booking.Phone,

                SpecialRequests =
                    booking.SpecialRequests,

                Status =
                    string.IsNullOrWhiteSpace(
                        booking.Status
                    )
                        ? "pending"
                        : booking.Status,

                CreatedAt =
                    string.IsNullOrWhiteSpace(
                        booking.CreatedAt
                    )
                        ? DateTime.UtcNow.ToString("O")
                        : booking.CreatedAt
            };

        bookings.Insert(
            0,
            newBooking
        );

        SaveBookings(bookings);

        return ToDto(newBooking);
    }

    public TransferBookingDto? Update(
        string id,
        TransferBookingDto booking
    )
    {
        var bookings = LoadBookings();

        var existingBooking =
            bookings.FirstOrDefault(
                item =>
                    item.Id.Equals(
                        id,
                        StringComparison.OrdinalIgnoreCase
                    )
            );

        if (existingBooking is null)
        {
            return null;
        }

        existingBooking.TransferType =
            booking.TransferType;

        existingBooking.OptionId =
            booking.OptionId;

        existingBooking.OptionTitle =
            booking.OptionTitle;

        existingBooking.Price =
            booking.Price;

        existingBooking.VehicleId =
            booking.VehicleId;

        existingBooking.VehicleName =
            booking.VehicleName;

        existingBooking.LicensePlate =
            booking.LicensePlate;

        existingBooking.DriverId =
            booking.DriverId;

        existingBooking.DriverName =
            booking.DriverName;

        existingBooking.Pickup =
            booking.Pickup;

        existingBooking.Destination =
            booking.Destination;

        existingBooking.Date =
            booking.Date;

        existingBooking.Time =
            booking.Time;

        existingBooking.Passengers =
            booking.Passengers;

        existingBooking.ReturnDate =
            booking.ReturnDate;

        existingBooking.ReturnTime =
            booking.ReturnTime;

        existingBooking.FirstName =
            booking.FirstName;

        existingBooking.LastName =
            booking.LastName;

        existingBooking.Email =
            booking.Email;

        existingBooking.Phone =
            booking.Phone;

        existingBooking.SpecialRequests =
            booking.SpecialRequests;

        existingBooking.Status =
            booking.Status;

        if (
            !string.IsNullOrWhiteSpace(
                booking.CreatedAt
            )
        )
        {
            existingBooking.CreatedAt =
                booking.CreatedAt;
        }

        SaveBookings(bookings);

        return ToDto(existingBooking);
    }

    public bool Delete(
        string id
    )
    {
        var bookings = LoadBookings();

        var booking =
            bookings.FirstOrDefault(
                item =>
                    item.Id.Equals(
                        id,
                        StringComparison.OrdinalIgnoreCase
                    )
            );

        if (booking is null)
        {
            return false;
        }

        bookings.Remove(booking);

        SaveBookings(bookings);

        return true;
    }

    private List<TransferBookingEntity> LoadBookings()
    {
        if (!File.Exists(_dataPath))
        {
            return new List<TransferBookingEntity>();
        }

        var json =
            File.ReadAllText(_dataPath);

        if (string.IsNullOrWhiteSpace(json))
        {
            return new List<TransferBookingEntity>();
        }

        return JsonSerializer.Deserialize<
                   List<TransferBookingEntity>
               >(
                   json,
                   _jsonOptions
               )
               ?? new List<TransferBookingEntity>();
    }

    private void SaveBookings(
        List<TransferBookingEntity> bookings
    )
    {
        var json =
            JsonSerializer.Serialize(
                bookings,
                _jsonOptions
            );

        File.WriteAllText(
            _dataPath,
            json
        );
    }

    private static TransferBookingDto ToDto(
        TransferBookingEntity booking
    )
    {
        return new TransferBookingDto
        {
            Id = booking.Id,

            TransferType =
                booking.TransferType,

            OptionId =
                booking.OptionId,

            OptionTitle =
                booking.OptionTitle,

            Price =
                booking.Price,

            VehicleId =
                booking.VehicleId,

            VehicleName =
                booking.VehicleName,

            LicensePlate =
                booking.LicensePlate,

            DriverId =
                booking.DriverId,

            DriverName =
                booking.DriverName,

            Pickup =
                booking.Pickup,

            Destination =
                booking.Destination,

            Date =
                booking.Date,

            Time =
                booking.Time,

            Passengers =
                booking.Passengers,

            ReturnDate =
                booking.ReturnDate,

            ReturnTime =
                booking.ReturnTime,

            FirstName =
                booking.FirstName,

            LastName =
                booking.LastName,

            Email =
                booking.Email,

            Phone =
                booking.Phone,

            SpecialRequests =
                booking.SpecialRequests,

            Status =
                booking.Status,

            CreatedAt =
                booking.CreatedAt
        };
    }
}