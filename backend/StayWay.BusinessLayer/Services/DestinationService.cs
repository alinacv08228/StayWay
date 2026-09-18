using Microsoft.EntityFrameworkCore;
using StayWay.DataAccessLayer.Context;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class DestinationService : IDestinationService
{
    private readonly AppDbContext _context;

    public DestinationService(
        AppDbContext context
    )
    {
        _context = context;
    }

    public List<DestinationDto> GetAll()
    {
        return _context.Destinations
            .AsNoTracking()
            .OrderBy(destination => destination.Id)
            .Select(destination =>
                new DestinationDto
                {
                    Id = destination.Id,
                    Name = destination.Name,
                    Country = destination.Country,
                    Image = destination.Image,
                    CountryImage =
                        destination.CountryImage
                }
            )
            .ToList();
    }

    public DestinationDto? GetById(
        long id
    )
    {
        var destination =
            _context.Destinations
                .AsNoTracking()
                .FirstOrDefault(
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
        var entity =
            new DestinationEntity
            {
                Name = destination.Name,
                Country = destination.Country,
                Image = destination.Image,
                CountryImage =
                    destination.CountryImage
            };

        if (destination.Id > 0)
        {
            entity.Id = destination.Id;
        }

        _context.Destinations.Add(entity);
        _context.SaveChanges();

        return ToDto(entity);
    }

    public DestinationDto? Update(
        long id,
        DestinationDto destination
    )
    {
        var existing =
            _context.Destinations
                .FirstOrDefault(
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

        _context.SaveChanges();

        return ToDto(existing);
    }

    public bool Delete(
        long id
    )
    {
        var destination =
            _context.Destinations
                .FirstOrDefault(
                    item => item.Id == id
                );

        if (destination is null)
        {
            return false;
        }

        var hasProperties =
            _context.Properties.Any(
                property =>
                    property.DestinationId == id
            );

        if (hasProperties)
        {
            throw new InvalidOperationException(
                "This destination cannot be deleted because it still has properties assigned to it."
            );
        }

        _context.Destinations.Remove(
            destination
        );

        try
        {
            _context.SaveChanges();
        }
        catch (DbUpdateException exception)
        {
            throw new InvalidOperationException(
                "This destination cannot be deleted because it is referenced by other data.",
                exception
            );
        }

        return true;
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