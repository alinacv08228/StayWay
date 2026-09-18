using Microsoft.EntityFrameworkCore;
using StayWay.DataAccessLayer.Context;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class PropertyService : IPropertyService
{
    private readonly AppDbContext _context;

    public PropertyService(
        AppDbContext context
    )
    {
        _context = context;
    }

    public List<PropertyDto> GetAll()
    {
        return _context.Properties
            .AsNoTracking()
            .OrderBy(property => property.Id)
            .Select(property =>
                new PropertyDto
                {
                    Id = property.Id,
                    Name = property.Name,
                    Description = property.Description,
                    DestinationId = property.DestinationId,
                    Address = property.Address,
                    Stars = property.Stars,
                    Rating = property.Rating,
                    PricePerNight = property.PricePerNight,
                    Image = property.Image
                }
            )
            .ToList();
    }

    public PropertyDto? GetById(
        int id
    )
    {
        var property =
            _context.Properties
                .AsNoTracking()
                .FirstOrDefault(
                    item => item.Id == id
                );

        return property is null
            ? null
            : ToDto(property);
    }

    public PropertyDto Create(
        PropertyDto property
    )
    {
        var entity =
            new PropertyEntity
            {
                Name = property.Name,
                Description = property.Description,
                DestinationId = property.DestinationId,
                Address = property.Address,
                Stars = property.Stars,
                Rating = property.Rating,
                PricePerNight = property.PricePerNight,
                Image = property.Image
            };

        _context.Properties.Add(entity);
        _context.SaveChanges();

        return ToDto(entity);
    }

    public PropertyDto? Update(
        int id,
        PropertyDto property
    )
    {
        var existing =
            _context.Properties
                .FirstOrDefault(
                    item => item.Id == id
                );

        if (existing is null)
        {
            return null;
        }

        existing.Name =
            property.Name;

        existing.Description =
            property.Description;

        existing.DestinationId =
            property.DestinationId;

        existing.Address =
            property.Address;

        existing.Stars =
            property.Stars;

        existing.Rating =
            property.Rating;

        existing.PricePerNight =
            property.PricePerNight;

        existing.Image =
            property.Image;

        _context.SaveChanges();

        return ToDto(existing);
    }

    public bool Delete(
        int id
    )
    {
        var property =
            _context.Properties
                .FirstOrDefault(
                    item => item.Id == id
                );

        if (property is null)
        {
            return false;
        }

        _context.Properties.Remove(
            property
        );

        _context.SaveChanges();

        return true;
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
            Image = property.Image
        };
    }
}
