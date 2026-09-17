using System.Text.Json;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class TransferVehicleService : ITransferVehicleService
{
    private readonly string _dataPath;

    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };

    public TransferVehicleService(string dataPath)
    {
        _dataPath = dataPath;

        EnsureDataFileExists();
    }

    public List<TransferVehicleDto> GetAll()
    {
        return LoadVehicles()
            .Select(ToDto)
            .ToList();
    }

    public TransferVehicleDto? GetById(string id)
    {
        var vehicle = LoadVehicles()
            .FirstOrDefault(vehicle =>
                string.Equals(
                    vehicle.Id,
                    id,
                    StringComparison.OrdinalIgnoreCase
                )
            );

        return vehicle is null
            ? null
            : ToDto(vehicle);
    }

    public List<TransferVehicleDto> GetByCity(string city)
    {
        return LoadVehicles()
            .Where(vehicle =>
                string.Equals(
                    vehicle.City,
                    city,
                    StringComparison.OrdinalIgnoreCase
                )
            )
            .Select(ToDto)
            .ToList();
    }

    public TransferVehicleDto Create(
        TransferVehicleDto vehicle
    )
    {
        var vehicles = LoadVehicles();

        var newVehicle = new TransferVehicleEntity
        {
            Id = string.IsNullOrWhiteSpace(vehicle.Id)
                ? $"vehicle-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}"
                : vehicle.Id.Trim(),

            City = vehicle.City.Trim(),
            Name = vehicle.Name.Trim(),
            LicensePlate = vehicle.LicensePlate.Trim(),
            Category = vehicle.Category.Trim(),
            Passengers = vehicle.Passengers,
            Luggage = vehicle.Luggage,
            Image = vehicle.Image.Trim(),
            DriverId = string.IsNullOrWhiteSpace(vehicle.DriverId)
                ? null
                : vehicle.DriverId.Trim()
        };

        vehicles.Add(newVehicle);

        SaveVehicles(vehicles);

        return ToDto(newVehicle);
    }

    public TransferVehicleDto? Update(
        string id,
        TransferVehicleDto vehicle
    )
    {
        var vehicles = LoadVehicles();

        var existingVehicle = vehicles
            .FirstOrDefault(item =>
                string.Equals(
                    item.Id,
                    id,
                    StringComparison.OrdinalIgnoreCase
                )
            );

        if (existingVehicle is null)
        {
            return null;
        }

        existingVehicle.City = vehicle.City.Trim();
        existingVehicle.Name = vehicle.Name.Trim();
        existingVehicle.LicensePlate =
            vehicle.LicensePlate.Trim();
        existingVehicle.Category =
            vehicle.Category.Trim();
        existingVehicle.Passengers =
            vehicle.Passengers;
        existingVehicle.Luggage =
            vehicle.Luggage;
        existingVehicle.Image =
            vehicle.Image.Trim();
        existingVehicle.DriverId =
            string.IsNullOrWhiteSpace(vehicle.DriverId)
                ? null
                : vehicle.DriverId.Trim();

        SaveVehicles(vehicles);

        return ToDto(existingVehicle);
    }

    public bool Delete(string id)
    {
        var vehicles = LoadVehicles();

        var vehicle = vehicles
            .FirstOrDefault(item =>
                string.Equals(
                    item.Id,
                    id,
                    StringComparison.OrdinalIgnoreCase
                )
            );

        if (vehicle is null)
        {
            return false;
        }

        vehicles.Remove(vehicle);

        SaveVehicles(vehicles);

        return true;
    }

    private List<TransferVehicleEntity> LoadVehicles()
    {
        EnsureDataFileExists();

        var json = File.ReadAllText(_dataPath);

        if (string.IsNullOrWhiteSpace(json))
        {
            return new List<TransferVehicleEntity>();
        }

        return JsonSerializer.Deserialize<
                   List<TransferVehicleEntity>
               >(
                   json,
                   _jsonOptions
               )
               ?? new List<TransferVehicleEntity>();
    }

    private void SaveVehicles(
        List<TransferVehicleEntity> vehicles
    )
    {
        var json = JsonSerializer.Serialize(
            vehicles,
            _jsonOptions
        );

        File.WriteAllText(
            _dataPath,
            json
        );
    }

    private void EnsureDataFileExists()
    {
        var directory =
            Path.GetDirectoryName(_dataPath);

        if (
            !string.IsNullOrWhiteSpace(directory) &&
            !Directory.Exists(directory)
        )
        {
            Directory.CreateDirectory(directory);
        }

        if (!File.Exists(_dataPath))
        {
            File.WriteAllText(
                _dataPath,
                "[]"
            );
        }
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