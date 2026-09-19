using Microsoft.AspNetCore.Mvc;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransferLocationsController
    : ControllerBase
{
    private readonly ITransferLocationService
        _transferLocationService;

    public TransferLocationsController(
        ITransferLocationService transferLocationService
    )
    {
        _transferLocationService =
            transferLocationService;
    }

    [HttpGet]
    public ActionResult<List<TransferLocationDto>>
        GetAll()
    {
        return Ok(
            _transferLocationService.GetAll()
        );
    }

    [HttpGet("city/{city}")]
    public ActionResult<List<TransferLocationDto>>
        GetByCity(
            string city
        )
    {
        return Ok(
            _transferLocationService.GetByCity(city)
        );
    }
}