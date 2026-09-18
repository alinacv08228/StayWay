using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DestinationsController : ControllerBase
{
    private readonly IDestinationService
        _destinationService;

    public DestinationsController(
        IDestinationService destinationService
    )
    {
        _destinationService =
            destinationService;
    }

    [HttpGet]
    public ActionResult<List<DestinationDto>>
        GetAll()
    {
        return Ok(
            _destinationService.GetAll()
        );
    }

    [HttpGet("{id:long}")]
    public ActionResult<DestinationDto>
        GetById(
            long id
        )
    {
        var destination =
            _destinationService.GetById(
                id
            );

        if (destination is null)
        {
            return NotFound();
        }

        return Ok(destination);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public ActionResult<DestinationDto>
        Create(
            DestinationDto destination
        )
    {
        var createdDestination =
            _destinationService.Create(
                destination
            );

        return CreatedAtAction(
            nameof(GetById),
            new
            {
                id = createdDestination.Id
            },
            createdDestination
        );
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id:long}")]
    public ActionResult<DestinationDto>
        Update(
            long id,
            DestinationDto destination
        )
    {
        var updatedDestination =
            _destinationService.Update(
                id,
                destination
            );

        if (updatedDestination is null)
        {
            return NotFound();
        }

        return Ok(
            updatedDestination
        );
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id:long}")]
    public IActionResult Delete(
        long id
    )
    {
        try
        {
            var deleted =
                _destinationService.Delete(
                    id
                );

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (
            InvalidOperationException
            exception
        )
        {
            return Conflict(
                new
                {
                    message =
                        exception.Message
                }
            );
        }
    }
}