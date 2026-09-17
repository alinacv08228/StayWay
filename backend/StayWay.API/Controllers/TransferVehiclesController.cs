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
        if (string.IsNullOrWhiteSpace(vehicle.City))
        {
            return BadRequest(
                new
                {
                    message = "City is required."
                }
            );
        }

        if (string.IsNullOrWhiteSpace(vehicle.Name))
        {
            return BadRequest(
                new
                {
                    message = "Vehicle name is required."
                }
            );
        }

        if (string.IsNullOrWhiteSpace(vehicle.LicensePlate))
        {
            return BadRequest(
                new
                {
                    message = "License plate is required."
                }
            );
        }

        if (
            vehicle.Category != "Private" &&
            vehicle.Category != "Comfort" &&
            vehicle.Category != "Family"
        )
        {
            return BadRequest(
                new
                {
                    message =
                        "Category must be Private, Comfort or Family."
                }
            );
        }

        if (vehicle.Passengers <= 0)
        {
            return BadRequest(
                new
                {
                    message =
                        "Passengers must be greater than 0."
                }
            );
        }

        if (vehicle.Luggage < 0)
        {
            return BadRequest(
                new
                {
                    message =
                        "Luggage cannot be negative."
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
}