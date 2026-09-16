using System.Text.Json;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class DestinationService : IDestinationService
{
    private readonly string _filePath;
    private readonly List<DestinationEntity> _destinations;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };

    public DestinationService(string filePath)
    {
        _filePath = filePath;

        var directory = Path.GetDirectoryName(_filePath);

        if (!string.IsNullOrWhiteSpace(directory))
        {
            Directory.CreateDirectory(directory);
        }

        _destinations = LoadDestinations();
    }

    public List<DestinationDto> GetAll()
    {
        return _destinations
            .Select(ToDto)
            .ToList();
    }

    public DestinationDto? GetById(long id)
    {
        var destination =
            _destinations.FirstOrDefault(
                item => item.Id == id
            );

        return destination is null
            ? null
            : ToDto(destination);
    }

    public DestinationDto Create(
        DestinationDto destination
    )
    {
        var nextId =
            destination.Id > 0
                ? destination.Id
                : GetNextId();

        var entity =
            new DestinationEntity
            {
                Id = nextId,
                Name = destination.Name,
                Country = destination.Country,
                Image = destination.Image,
                CountryImage =
                    destination.CountryImage
            };

        _destinations.Add(entity);
        SaveDestinations();

        return ToDto(entity);
    }

    public DestinationDto? Update(
        long id,
        DestinationDto destination
    )
    {
        var existing =
            _destinations.FirstOrDefault(
                item => item.Id == id
            );

        if (existing is null)
        {
            return null;
        }

        existing.Name =
            destination.Name;

        existing.Country =
            destination.Country;

        existing.Image =
            destination.Image;

        existing.CountryImage =
            destination.CountryImage;

        SaveDestinations();

        return ToDto(existing);
    }

    public bool Delete(long id)
    {
        var destination =
            _destinations.FirstOrDefault(
                item => item.Id == id
            );

        if (destination is null)
        {
            return false;
        }

        _destinations.Remove(destination);
        SaveDestinations();

        return true;
    }

    private long GetNextId()
    {
        if (_destinations.Count == 0)
        {
            return 1;
        }

        return _destinations.Max(
            item => item.Id
        ) + 1;
    }

    private List<DestinationEntity>
        LoadDestinations()
    {
        if (!File.Exists(_filePath))
        {
            return [];
        }

        try
        {
            var json =
                File.ReadAllText(
                    _filePath
                );

            return JsonSerializer
                .Deserialize<
                    List<DestinationEntity>
                >(
                    json,
                    JsonOptions
                ) ?? [];
        }
        catch
        {
            return [];
        }
    }

    private void SaveDestinations()
    {
        var json =
            JsonSerializer.Serialize(
                _destinations,
                JsonOptions
            );

        File.WriteAllText(
            _filePath,
            json
        );
    }

    private static DestinationDto ToDto(
        DestinationEntity destination
    )
    {
        return new DestinationDto
        {
            Id = destination.Id,
            Name = destination.Name,
            Country = destination.Country,
            Image = destination.Image,
            CountryImage =
                destination.CountryImage
        };
    }
}
