using Microsoft.EntityFrameworkCore;
using StayWay.DataAccessLayer.Context;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class TransferBookingService : ITransferBookingService
{
    private readonly AppDbContext _context;

    public TransferBookingService(
        AppDbContext context
    )
    {
        _context = context;
    }

    public List<TransferBookingDto> GetAll()
    {
        return _context.TransferBookings
            .AsNoTracking()
            .OrderByDescending(
                booking => booking.CreatedAt
            )
            .Select(booking =>
                new TransferBookingDto
                {
                    Id = booking.Id,
                    UserId = booking.UserId,
                    TransferType = booking.TransferType,
                    OptionId = booking.OptionId,
                    OptionTitle = booking.OptionTitle,
                    Price = booking.Price,
                    VehicleId = booking.VehicleId,
                    VehicleName = booking.VehicleName,
                    LicensePlate = booking.LicensePlate,
                    DriverId = booking.DriverId,
                    DriverName = booking.DriverName,
                    Pickup = booking.Pickup,
                    Destination = booking.Destination,
                    Date = booking.Date,
                    Time = booking.Time,
                    Passengers = booking.Passengers,
                    ReturnDate = booking.ReturnDate,
                    ReturnTime = booking.ReturnTime,
                    FirstName = booking.FirstName,
                    LastName = booking.LastName,
                    Email = booking.Email,
                    Phone = booking.Phone,
                    SpecialRequests =
                        booking.SpecialRequests,
                    Status = booking.Status,
                    CreatedAt = booking.CreatedAt
                }
            )
            .ToList();
    }

    public TransferBookingDto? GetById(
        string id
    )
    {
        var normalizedId =
            id.Trim().ToLower();

        var booking =
            _context.TransferBookings
                .AsNoTracking()
                .FirstOrDefault(
                    item =>
                        item.Id.ToLower() ==
                        normalizedId
                );

        return booking is null
            ? null
            : ToDto(booking);
    }

    public List<TransferBookingDto> GetByDriverId(
        string driverId
    )
    {
        var normalizedDriverId =
            driverId.Trim().ToLower();

        return _context.TransferBookings
            .AsNoTracking()
            .Where(
                booking =>
                    booking.DriverId != null &&
                    booking.DriverId.ToLower() ==
                    normalizedDriverId
            )
            .OrderByDescending(
                booking => booking.CreatedAt
            )
            .Select(booking =>
                new TransferBookingDto
                {
                    Id = booking.Id,
                    UserId = booking.UserId,
                    TransferType = booking.TransferType,
                    OptionId = booking.OptionId,
                    OptionTitle = booking.OptionTitle,
                    Price = booking.Price,
                    VehicleId = booking.VehicleId,
                    VehicleName = booking.VehicleName,
                    LicensePlate = booking.LicensePlate,
                    DriverId = booking.DriverId,
                    DriverName = booking.DriverName,
                    Pickup = booking.Pickup,
                    Destination = booking.Destination,
                    Date = booking.Date,
                    Time = booking.Time,
                    Passengers = booking.Passengers,
                    ReturnDate = booking.ReturnDate,
                    ReturnTime = booking.ReturnTime,
                    FirstName = booking.FirstName,
                    LastName = booking.LastName,
                    Email = booking.Email,
                    Phone = booking.Phone,
                    SpecialRequests =
                        booking.SpecialRequests,
                    Status = booking.Status,
                    CreatedAt = booking.CreatedAt
                }
            )
            .ToList();
    }

    public TransferBookingDto Create(
        TransferBookingDto booking
    )
    {
        var entity =
            new TransferBookingEntity
            {
                Id =
                    string.IsNullOrWhiteSpace(
                        booking.Id
                    )
                        ? GenerateBookingId()
                        : booking.Id.Trim(),

                UserId =
                    string.IsNullOrWhiteSpace(
                        booking.UserId
                    )
                        ? null
                        : booking.UserId.Trim(),

                TransferType =
                    booking.TransferType,

                OptionId =
                    booking.OptionId,

                OptionTitle =
                    booking.OptionTitle,

                Price =
                    booking.Price,

                VehicleId =
                    string.IsNullOrWhiteSpace(
                        booking.VehicleId
                    )
                        ? null
                        : booking.VehicleId.Trim(),

                VehicleName =
                    booking.VehicleName,

                LicensePlate =
                    booking.LicensePlate,

                DriverId =
                    string.IsNullOrWhiteSpace(
                        booking.DriverId
                    )
                        ? null
                        : booking.DriverId.Trim(),

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

        _context.TransferBookings.Add(
            entity
        );

        _context.SaveChanges();

        return ToDto(entity);
    }

    public TransferBookingDto? Update(
        string id,
        TransferBookingDto booking
    )
    {
        var normalizedId =
            id.Trim().ToLower();

        var existing =
            _context.TransferBookings
                .FirstOrDefault(
                    item =>
                        item.Id.ToLower() ==
                        normalizedId
                );

        if (existing is null)
        {
            return null;
        }

        existing.TransferType =
            booking.TransferType;

        existing.OptionId =
            booking.OptionId;

        existing.OptionTitle =
            booking.OptionTitle;

        existing.Price =
            booking.Price;

        existing.VehicleId =
            string.IsNullOrWhiteSpace(
                booking.VehicleId
            )
                ? null
                : booking.VehicleId.Trim();

        existing.VehicleName =
            booking.VehicleName;

        existing.LicensePlate =
            booking.LicensePlate;

        existing.DriverId =
            string.IsNullOrWhiteSpace(
                booking.DriverId
            )
                ? null
                : booking.DriverId.Trim();

        existing.DriverName =
            booking.DriverName;

        existing.Pickup =
            booking.Pickup;

        existing.Destination =
            booking.Destination;

        existing.Date =
            booking.Date;

        existing.Time =
            booking.Time;

        existing.Passengers =
            booking.Passengers;

        existing.ReturnDate =
            booking.ReturnDate;

        existing.ReturnTime =
            booking.ReturnTime;

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

        existing.Status =
            booking.Status;

        if (
            !string.IsNullOrWhiteSpace(
                booking.CreatedAt
            )
        )
        {
            existing.CreatedAt =
                booking.CreatedAt;
        }

        _context.SaveChanges();

        return ToDto(existing);
    }

    public bool Delete(
        string id
    )
    {
        var normalizedId =
            id.Trim().ToLower();

        var booking =
            _context.TransferBookings
                .FirstOrDefault(
                    item =>
                        item.Id.ToLower() ==
                        normalizedId
                );

        if (booking is null)
        {
            return false;
        }

        _context.TransferBookings.Remove(
            booking
        );

        _context.SaveChanges();

        return true;
    }

    private string GenerateBookingId()
    {
        string id;

        do
        {
            id =
                $"transfer-booking-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        }
        while (
            _context.TransferBookings.Any(
                booking =>
                    booking.Id == id
            )
        );

        return id;
    }

    private static TransferBookingDto ToDto(
        TransferBookingEntity booking
    )
    {
        return new TransferBookingDto
        {
            Id = booking.Id,
            UserId = booking.UserId,
            TransferType = booking.TransferType,
            OptionId = booking.OptionId,
            OptionTitle = booking.OptionTitle,
            Price = booking.Price,
            VehicleId = booking.VehicleId,
            VehicleName = booking.VehicleName,
            LicensePlate = booking.LicensePlate,
            DriverId = booking.DriverId,
            DriverName = booking.DriverName,
            Pickup = booking.Pickup,
            Destination = booking.Destination,
            Date = booking.Date,
            Time = booking.Time,
            Passengers = booking.Passengers,
            ReturnDate = booking.ReturnDate,
            ReturnTime = booking.ReturnTime,
            FirstName = booking.FirstName,
            LastName = booking.LastName,
            Email = booking.Email,
            Phone = booking.Phone,
            SpecialRequests =
                booking.SpecialRequests,
            Status = booking.Status,
            CreatedAt = booking.CreatedAt
        };
    }
}