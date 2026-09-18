using Microsoft.EntityFrameworkCore;
using StayWay.DataAccessLayer.Context;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class TransferDriverService : ITransferDriverService
{
    private readonly AppDbContext _context;

    public TransferDriverService(
        AppDbContext context
    )
    {
        _context = context;
    }

    public List<TransferDriverDto> GetAll()
    {
        return _context.TransferDrivers
            .AsNoTracking()
            .OrderBy(driver => driver.Id)
            .Select(driver =>
                new TransferDriverDto
                {
                    Id = driver.Id,
                    City = driver.City,
                    Name = driver.Name,
                    Phone = driver.Phone,
                    Status = driver.Status
                }
            )
            .ToList();
    }

    public TransferDriverDto? GetById(
        string id
    )
    {
        var normalizedId =
            id.Trim().ToLower();

        var driver =
            _context.TransferDrivers
                .AsNoTracking()
                .FirstOrDefault(
                    item =>
                        item.Id.ToLower() ==
                        normalizedId
                );

        return driver is null
            ? null
            : ToDto(driver);
    }

    public List<TransferDriverDto> GetByCity(
        string city
    )
    {
        var normalizedCity =
            city.Trim().ToLower();

        return _context.TransferDrivers
            .AsNoTracking()
            .Where(driver =>
                driver.City.ToLower() ==
                normalizedCity
            )
            .OrderBy(driver => driver.Id)
            .Select(driver =>
                new TransferDriverDto
                {
                    Id = driver.Id,
                    City = driver.City,
                    Name = driver.Name,
                    Phone = driver.Phone,
                    Status = driver.Status
                }
            )
            .ToList();
    }

    public TransferDriverDto Create(
        TransferDriverDto driver
    )
    {
        var id =
            string.IsNullOrWhiteSpace(driver.Id)
                ? GenerateDriverId()
                : driver.Id.Trim();

        var entity =
            new TransferDriverEntity
            {
                Id = id,
                City = driver.City,
                Name = driver.Name,
                Phone = driver.Phone,
                Status = driver.Status
            };

        _context.TransferDrivers.Add(entity);
        _context.SaveChanges();

        return ToDto(entity);
    }

    public TransferDriverDto? Update(
        string id,
        TransferDriverDto driver
    )
    {
        var normalizedId =
            id.Trim().ToLower();

        var existing =
            _context.TransferDrivers
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
            driver.City;

        existing.Name =
            driver.Name;

        existing.Phone =
            driver.Phone;

        existing.Status =
            driver.Status;

        _context.SaveChanges();

        return ToDto(existing);
    }

    public bool Delete(
        string id
    )
    {
        var normalizedId =
            id.Trim().ToLower();

        var driver =
            _context.TransferDrivers
                .FirstOrDefault(
                    item =>
                        item.Id.ToLower() ==
                        normalizedId
                );

        if (driver is null)
        {
            return false;
        }

        _context.TransferDrivers.Remove(driver);
        _context.SaveChanges();

        return true;
    }

    private string GenerateDriverId()
    {
        string id;

        do
        {
            id =
                $"driver-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        }
        while (
            _context.TransferDrivers.Any(
                driver => driver.Id == id
            )
        );

        return id;
    }

    private static TransferDriverDto ToDto(
        TransferDriverEntity driver
    )
    {
        return new TransferDriverDto
        {
            Id = driver.Id,
            City = driver.City,
            Name = driver.Name,
            Phone = driver.Phone,
            Status = driver.Status
        };
    }
}
