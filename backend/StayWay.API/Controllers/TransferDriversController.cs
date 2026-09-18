using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransferDriversController
    : ControllerBase
{
    private readonly ITransferDriverService
        _transferDriverService;

    public TransferDriversController(
        ITransferDriverService
            transferDriverService
    )
    {
        _transferDriverService =
            transferDriverService;
    }

    [HttpGet]
    public ActionResult<
        List<TransferDriverDto>
    > GetAll()
    {
        return Ok(
            _transferDriverService
                .GetAll()
        );
    }

    [HttpGet("{id}")]
    public ActionResult<TransferDriverDto>
        GetById(
            string id
        )
    {
        var driver =
            _transferDriverService
                .GetById(id);

        if (driver is null)
        {
            return NotFound();
        }

        return Ok(driver);
    }

    [HttpGet("city/{city}")]
    public ActionResult<
        List<TransferDriverDto>
    > GetByCity(
        string city
    )
    {
        return Ok(
            _transferDriverService
                .GetByCity(city)
        );
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public ActionResult<TransferDriverDto>
        Create(
            TransferDriverDto driver
        )
    {
        var validationError =
            ValidateDriver(driver);

        if (validationError is not null)
        {
            return BadRequest(
                new
                {
                    message =
                        validationError
                }
            );
        }

        var createdDriver =
            _transferDriverService
                .Create(driver);

        return CreatedAtAction(
            nameof(GetById),
            new
            {
                id =
                    createdDriver.Id
            },
            createdDriver
        );
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id}")]
    public ActionResult<TransferDriverDto>
        Update(
            string id,
            TransferDriverDto driver
        )
    {
        var validationError =
            ValidateDriver(driver);

        if (validationError is not null)
        {
            return BadRequest(
                new
                {
                    message =
                        validationError
                }
            );
        }

        var updatedDriver =
            _transferDriverService.Update(
                id,
                driver
            );

        if (updatedDriver is null)
        {
            return NotFound();
        }

        return Ok(updatedDriver);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public IActionResult Delete(
        string id
    )
    {
        var deleted =
            _transferDriverService
                .Delete(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    private static string?
        ValidateDriver(
            TransferDriverDto driver
        )
    {
        if (
            string.IsNullOrWhiteSpace(
                driver.City
            )
        )
        {
            return "City is required.";
        }

        if (
            string.IsNullOrWhiteSpace(
                driver.Name
            )
        )
        {
            return "Name is required.";
        }

        if (
            string.IsNullOrWhiteSpace(
                driver.Phone
            )
        )
        {
            return "Phone is required.";
        }

        var allowedStatuses =
            new[]
            {
                "available",
                "busy",
                "inactive"
            };

        if (
            !allowedStatuses.Contains(
                driver.Status,
                StringComparer.OrdinalIgnoreCase
            )
        )
        {
            return
                "Status must be available, busy, or inactive.";
        }

        return null;
    }
}