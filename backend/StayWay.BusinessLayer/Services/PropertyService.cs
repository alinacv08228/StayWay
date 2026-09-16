using System.Text.Json;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class PropertyService : IPropertyService
{
    private readonly string _filePath;
    private readonly List<PropertyEntity> _properties;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };

    public PropertyService(string filePath)
    {
        _filePath = filePath;

        var directory = Path.GetDirectoryName(_filePath);

        if (!string.IsNullOrWhiteSpace(directory))
        {
            Directory.CreateDirectory(directory);
        }

        _properties = LoadProperties();
    }

    public List<PropertyDto> GetAll()
    {
        return _properties
            .Select(ToDto)
            .ToList();
    }

    public PropertyDto? GetById(int id)
    {
        var property = _properties
            .FirstOrDefault(item => item.Id == id);

        return property is null
            ? null
            : ToDto(property);
    }

    public PropertyDto Create(PropertyDto property)
    {
        var nextId =
            _properties.Count == 0
                ? 1
                : _properties.Max(item => item.Id) + 1;

        var entity = new PropertyEntity
        {
            Id = nextId,
            Name = property.Name,
            Description = property.Description,
            DestinationId = property.DestinationId,
            Address = property.Address,
            Stars = property.Stars,
            Rating = property.Rating,
            PricePerNight = property.PricePerNight,
            Image = property.Image,
        };

        _properties.Add(entity);
        SaveProperties();

        return ToDto(entity);
    }

    public PropertyDto? Update(
        int id,
        PropertyDto property
    )
    {
        var existing = _properties
            .FirstOrDefault(item => item.Id == id);

        if (existing is null)
        {
            return null;
        }

        existing.Name = property.Name;
        existing.Description = property.Description;
        existing.DestinationId = property.DestinationId;
        existing.Address = property.Address;
        existing.Stars = property.Stars;
        existing.Rating = property.Rating;
        existing.PricePerNight = property.PricePerNight;
        existing.Image = property.Image;

        SaveProperties();

        return ToDto(existing);
    }

    public bool Delete(int id)
    {
        var property = _properties
            .FirstOrDefault(item => item.Id == id);

        if (property is null)
        {
            return false;
        }

        _properties.Remove(property);
        SaveProperties();

        return true;
    }

    private List<PropertyEntity> LoadProperties()
    {
        if (!File.Exists(_filePath))
        {
            return [];
        }

        try
        {
            var json = File.ReadAllText(_filePath);

            return JsonSerializer.Deserialize<List<PropertyEntity>>(
                       json,
                       JsonOptions
                   ) ?? [];
        }
        catch
        {
            return [];
        }
    }

    private void SaveProperties()
    {
        var json = JsonSerializer.Serialize(
            _properties,
            JsonOptions
        );

        File.WriteAllText(_filePath, json);
    }

    private static PropertyDto ToDto(
        PropertyEntity property
    )
    {
        return new PropertyDto
        {
            Id = property.Id,
            Name = property.Name,
            Description = property.Description,
            DestinationId = property.DestinationId,
            Address = property.Address,
            Stars = property.Stars,
            Rating = property.Rating,
            PricePerNight = property.PricePerNight,
            Image = property.Image,
        };
    }
}
