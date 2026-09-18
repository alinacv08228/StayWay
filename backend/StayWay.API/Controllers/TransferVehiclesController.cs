using Microsoft.AspNetCore.Mvc;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransferVehiclesController : ControllerBase
{
    private readonly ITransferVehicleService _transferVehicleService;

    public TransferVehiclesController(
        ITransferVehicleService transferVehicleService
    )
    {
        _transferVehicleService = transferVehicleService;
    }

    [HttpGet]
    public ActionResult<List<TransferVehicleDto>> GetAll()
    {
        return Ok(
            _transferVehicleService.GetAll()
        );
    }

    [HttpGet("{id}")]
    public ActionResult<TransferVehicleDto> GetById(
        string id
    )
    {
        var vehicle =
            _transferVehicleService.GetById(id);

        if (vehicle is null)
        {
            return NotFound();
        }

        return Ok(vehicle);
    }

    [HttpGet("city/{city}")]
    public ActionResult<List<TransferVehicleDto>> GetByCity(
        string city
    )
    {
        return Ok(
            _transferVehicleService.GetByCity(city)
        );
    }

    [HttpPost]
    public ActionResult<TransferVehicleDto> Create(
        TransferVehicleDto vehicle
    )
    {
        var validationError =
            ValidateVehicle(vehicle);

        if (validationError is not null)
        {
            return BadRequest(
                new
                {
                    message = validationError
                }
            );
        }

        var createdVehicle =
            _transferVehicleService.Create(
                vehicle
            );

        return CreatedAtAction(
            nameof(GetById),
            new
            {
                id = createdVehicle.Id
            },
            createdVehicle
        );
    }

    [HttpPut("{id}")]
    public ActionResult<TransferVehicleDto> Update(
        string id,
        TransferVehicleDto vehicle
    )
    {
        var validationError =
            ValidateVehicle(vehicle);

        if (validationError is not null)
        {
            return BadRequest(
                new
                {
                    message = validationError
                }
            );
        }

        var updatedVehicle =
            _transferVehicleService.Update(
                id,
                vehicle
            );

        if (updatedVehicle is null)
        {
            return NotFound();
        }

        return Ok(updatedVehicle);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(
        string id
    )
    {
        var deleted =
            _transferVehicleService.Delete(
                id
            );

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    private static string? ValidateVehicle(
        TransferVehicleDto vehicle
    )
    {
        if (string.IsNullOrWhiteSpace(vehicle.City))
        {
            return "City is required.";
        }

        if (string.IsNullOrWhiteSpace(vehicle.Name))
        {
            return "Vehicle name is required.";
        }

        if (string.IsNullOrWhiteSpace(vehicle.LicensePlate))
        {
            return "License plate is required.";
        }

        var allowedCategories =
            new[]
            {
                "Private",
                "Comfort",
                "Family"
            };

        if (
            !allowedCategories.Contains(
                vehicle.Category,
                StringComparer.OrdinalIgnoreCase
            )
        )
        {
            return "Category must be Private, Comfort or Family.";
        }

        if (vehicle.Passengers <= 0)
        {
            return "Passengers must be greater than 0.";
        }

        if (vehicle.Luggage < 0)
        {
            return "Luggage cannot be negative.";
        }

        return null;
    }
}
