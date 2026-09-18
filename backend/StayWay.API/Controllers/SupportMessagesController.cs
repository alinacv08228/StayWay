using Microsoft.AspNetCore.Mvc;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SupportMessagesController
    : ControllerBase
{
    private readonly ISupportMessageService
        _supportMessageService;

    public SupportMessagesController(
        ISupportMessageService
            supportMessageService
    )
    {
        _supportMessageService =
            supportMessageService;
    }

    [HttpGet]
    public ActionResult<
        List<SupportMessageDto>
    > GetAll()
    {
        return Ok(
            _supportMessageService
                .GetAll()
        );
    }

    [HttpPost]
    public ActionResult<
        SupportMessageDto
    > Create(
        SupportMessageDto message
    )
    {
        var createdMessage =
            _supportMessageService
                .Create(message);

        return StatusCode(
            201,
            createdMessage
        );
    }
}