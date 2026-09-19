using Microsoft.EntityFrameworkCore;
using StayWay.DataAccessLayer.Context;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class TransferLocationService
    : ITransferLocationService
{
    private readonly AppDbContext _context;

    public TransferLocationService(
        AppDbContext context
    )
    {
        _context = context;
    }

    public List<TransferLocationDto> GetAll()
    {
        var destinations =
            _context.Destinations
                .AsNoTracking()
                .OrderBy(destination =>
                    destination.Name
                )
                .ToList();

        var properties =
            _context.Properties
                .AsNoTracking()
                .ToList();

        var airports =
            _context.Airports
                .AsNoTracking()
                .ToList();

        var locations =
            new List<TransferLocationDto>();

        foreach (var destination in destinations)
        {
            var cityAirports =
                airports
                    .Where(airport =>
                        string.Equals(
                            airport.City.Trim(),
                            destination.Name.Trim(),
                            StringComparison.OrdinalIgnoreCase
                        )
                    )
                    .OrderBy(airport =>
                        airport.Name
                    );

            foreach (var airport in cityAirports)
            {
                locations.Add(
                    new TransferLocationDto
                    {
                        Id = airport.Id,
                        CityId = destination.Id,
                        CityName = destination.Name,
                        Type = "airport",
                        Name = airport.Name,
                        Code = airport.Code,
                        SearchTerms =
                            airport.SearchTerms.ToList()
                    }
                );
            }

            var cityHotels =
                properties
                    .Where(property =>
                        property.DestinationId ==
                        destination.Id
                    )
                    .OrderBy(property =>
                        property.Name
                    );

            foreach (var hotel in cityHotels)
            {
                locations.Add(
                    new TransferLocationDto
                    {
                        Id = $"hotel-{hotel.Id}",
                        CityId = destination.Id,
                        CityName = destination.Name,
                        Type = "hotel",
                        Name = hotel.Name,
                        Code = null,
                        SearchTerms =
                        [
                            hotel.Name,
                            hotel.Address,
                            destination.Name,
                            "hotel"
                        ]
                    }
                );
            }
        }

        return locations;
    }

    public List<TransferLocationDto> GetByCity(
        string city
    )
    {
        var normalizedCity =
            city.Trim();

        return GetAll()
            .Where(location =>
                string.Equals(
                    location.CityName.Trim(),
                    normalizedCity,
                    StringComparison.OrdinalIgnoreCase
                )
            )
            .ToList();
    }
}