using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StayWay.BusinessLayer;
using StayWay.Domain.DTOs;

namespace StayWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly BusinessLogic _businessLogic;

    public PropertiesController(
        BusinessLogic businessLogic
    )
    {
        _businessLogic = businessLogic;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var properties =
            _businessLogic.Properties.GetAll();

        return Ok(properties);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(
        int id
    )
    {
        var property =
            _businessLogic.Properties.GetById(
                id
            );

        if (property is null)
        {
            return NotFound();
        }

        return Ok(property);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    public IActionResult Create(
        [FromBody] PropertyDto property
    )
    {
        var createdProperty =
            _businessLogic.Properties.Create(
                property
            );

        return CreatedAtAction(
            nameof(GetById),
            new
            {
                id = createdProperty.Id
            },
            createdProperty
        );
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id:int}")]
    public IActionResult Update(
        int id,
        [FromBody] PropertyDto property
    )
    {
        var updatedProperty =
            _businessLogic.Properties.Update(
                id,
                property
            );

        if (updatedProperty is null)
        {
            return NotFound();
        }

        return Ok(updatedProperty);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id:int}")]
    public IActionResult Delete(
        int id
    )
    {
        var deleted =
            _businessLogic.Properties.Delete(
                id
            );

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}