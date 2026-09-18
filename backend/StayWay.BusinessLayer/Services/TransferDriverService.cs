using System.Text.Json;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class TransferDriverService : ITransferDriverService
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

    public TransferDriverService(
        string dataPath
    )
    {
        _dataPath = dataPath;
    }

    public List<TransferDriverDto> GetAll()
    {
        return LoadDrivers()
            .Select(ToDto)
            .ToList();
    }

    public TransferDriverDto? GetById(
        string id
    )
    {
        var driver = LoadDrivers()
            .FirstOrDefault(
                item =>
                    item.Id.Equals(
                        id,
                        StringComparison.OrdinalIgnoreCase
                    )
            );

        return driver is null
            ? null
            : ToDto(driver);
    }

    public List<TransferDriverDto> GetByCity(
        string city
    )
    {
        return LoadDrivers()
            .Where(
                driver =>
                    driver.City.Equals(
                        city,
                        StringComparison.OrdinalIgnoreCase
                    )
            )
            .Select(ToDto)
            .ToList();
    }

    public TransferDriverDto Create(
        TransferDriverDto driver
    )
    {
        var drivers = LoadDrivers();

        var newDriver =
            new TransferDriverEntity
            {
                Id = string.IsNullOrWhiteSpace(
                    driver.Id
                )
                    ? $"driver-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}"
                    : driver.Id,

                City = driver.City,
                Name = driver.Name,
                Phone = driver.Phone,
                Status = driver.Status
            };

        drivers.Add(newDriver);

        SaveDrivers(drivers);

        return ToDto(newDriver);
    }

    public TransferDriverDto? Update(
        string id,
        TransferDriverDto driver
    )
    {
        var drivers = LoadDrivers();

        var existingDriver =
            drivers.FirstOrDefault(
                item =>
                    item.Id.Equals(
                        id,
                        StringComparison.OrdinalIgnoreCase
                    )
            );

        if (existingDriver is null)
        {
            return null;
        }

        existingDriver.City =
            driver.City;

        existingDriver.Name =
            driver.Name;

        existingDriver.Phone =
            driver.Phone;

        existingDriver.Status =
            driver.Status;

        SaveDrivers(drivers);

        return ToDto(existingDriver);
    }

    public bool Delete(
        string id
    )
    {
        var drivers = LoadDrivers();

        var driver =
            drivers.FirstOrDefault(
                item =>
                    item.Id.Equals(
                        id,
                        StringComparison.OrdinalIgnoreCase
                    )
            );

        if (driver is null)
        {
            return false;
        }

        drivers.Remove(driver);

        SaveDrivers(drivers);

        return true;
    }

    private List<TransferDriverEntity> LoadDrivers()
    {
        if (!File.Exists(_dataPath))
        {
            return new List<TransferDriverEntity>();
        }

        var json =
            File.ReadAllText(_dataPath);

        if (string.IsNullOrWhiteSpace(json))
        {
            return new List<TransferDriverEntity>();
        }

        return JsonSerializer.Deserialize<
                   List<TransferDriverEntity>
               >(
                   json,
                   _jsonOptions
               )
               ?? new List<TransferDriverEntity>();
    }

    private void SaveDrivers(
        List<TransferDriverEntity> drivers
    )
    {
        var json =
            JsonSerializer.Serialize(
                drivers,
                _jsonOptions
            );

        File.WriteAllText(
            _dataPath,
            json
        );
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