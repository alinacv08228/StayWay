using Microsoft.EntityFrameworkCore;
using StayWay.DataAccessLayer.Context;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class TransferVehicleService : ITransferVehicleService
{
    private readonly AppDbContext _context;

    public TransferVehicleService(
        AppDbContext context
    )
    {
        _context = context;
    }

    public List<TransferVehicleDto> GetAll()
    {
        return _context.TransferVehicles
            .AsNoTracking()
            .OrderBy(vehicle => vehicle.Id)
            .Select(vehicle =>
                new TransferVehicleDto
                {
                    Id = vehicle.Id,
                    City = vehicle.City,
                    Name = vehicle.Name,
                    LicensePlate = vehicle.LicensePlate,
                    Category = vehicle.Category,
                    Passengers = vehicle.Passengers,
                    Luggage = vehicle.Luggage,
                    Image = vehicle.Image,
                    DriverId = vehicle.DriverId
                }
            )
            .ToList();
    }

    public TransferVehicleDto? GetById(
        string id
    )
    {
        var normalizedId =
            id.Trim().ToLower();

        var vehicle =
            _context.TransferVehicles
                .AsNoTracking()
                .FirstOrDefault(
                    item =>
                        item.Id.ToLower() ==
                        normalizedId
                );

        return vehicle is null
            ? null
            : ToDto(vehicle);
    }

    public List<TransferVehicleDto> GetByCity(
        string city
    )
    {
        var normalizedCity =
            city.Trim().ToLower();

        return _context.TransferVehicles
            .AsNoTracking()
            .Where(vehicle =>
                vehicle.City.ToLower() ==
                normalizedCity
            )
            .OrderBy(vehicle => vehicle.Id)
            .Select(vehicle =>
                new TransferVehicleDto
                {
                    Id = vehicle.Id,
                    City = vehicle.City,
                    Name = vehicle.Name,
                    LicensePlate = vehicle.LicensePlate,
                    Category = vehicle.Category,
                    Passengers = vehicle.Passengers,
                    Luggage = vehicle.Luggage,
                    Image = vehicle.Image,
                    DriverId = vehicle.DriverId
                }
            )
            .ToList();
    }

    public TransferVehicleDto Create(
        TransferVehicleDto vehicle
    )
    {
        var entity =
            new TransferVehicleEntity
            {
                Id =
                    string.IsNullOrWhiteSpace(vehicle.Id)
                        ? GenerateVehicleId()
                        : vehicle.Id.Trim(),

                City = vehicle.City.Trim(),
                Name = vehicle.Name.Trim(),

                LicensePlate =
                    vehicle.LicensePlate.Trim(),

                Category =
                    vehicle.Category.Trim(),

                Passengers =
                    vehicle.Passengers,

                Luggage =
                    vehicle.Luggage,

                Image =
                    vehicle.Image.Trim(),

                DriverId =
                    string.IsNullOrWhiteSpace(
                        vehicle.DriverId
                    )
                        ? null
                        : vehicle.DriverId.Trim()
            };

        _context.TransferVehicles.Add(entity);
        _context.SaveChanges();

        return ToDto(entity);
    }

    public TransferVehicleDto? Update(
        string id,
        TransferVehicleDto vehicle
    )
    {
        var normalizedId =
            id.Trim().ToLower();

        var existing =
            _context.TransferVehicles
                .FirstOrDefault(
                    item =>
                        item.Id.ToLower() ==
                        normalizedId
                );

        if (existing is null)
        {
            return null;
        }

        existing.City =
            vehicle.City.Trim();

        existing.Name =
            vehicle.Name.Trim();

        existing.LicensePlate =
            vehicle.LicensePlate.Trim();

        existing.Category =
            vehicle.Category.Trim();

        existing.Passengers =
            vehicle.Passengers;

        existing.Luggage =
            vehicle.Luggage;

        existing.Image =
            vehicle.Image.Trim();

        existing.DriverId =
            string.IsNullOrWhiteSpace(
                vehicle.DriverId
            )
                ? null
                : vehicle.DriverId.Trim();

        _context.SaveChanges();

        return ToDto(existing);
    }

    public bool Delete(
        string id
    )
    {
        var normalizedId =
            id.Trim().ToLower();

        var vehicle =
            _context.TransferVehicles
                .FirstOrDefault(
                    item =>
                        item.Id.ToLower() ==
                        normalizedId
                );

        if (vehicle is null)
        {
            return false;
        }

        _context.TransferVehicles.Remove(
            vehicle
        );

        _context.SaveChanges();

        return true;
    }

    private string GenerateVehicleId()
    {
        string id;

        do
        {
            id =
                $"vehicle-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        }
        while (
            _context.TransferVehicles.Any(
                vehicle => vehicle.Id == id
            )
        );

        return id;
    }

    private static TransferVehicleDto ToDto(
        TransferVehicleEntity vehicle
    )
    {
        return new TransferVehicleDto
        {
            Id = vehicle.Id,
            City = vehicle.City,
            Name = vehicle.Name,
            LicensePlate = vehicle.LicensePlate,
            Category = vehicle.Category,
            Passengers = vehicle.Passengers,
            Luggage = vehicle.Luggage,
            Image = vehicle.Image,
            DriverId = vehicle.DriverId
        };
    }
}
