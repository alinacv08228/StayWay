using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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

    [Authorize(Roles = "admin")]
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

    [Authorize]
    [HttpPost]
    public ActionResult<
        SupportMessageDto
    > Create(
        SupportMessageDto message
    )
    {
        var currentUserId =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        var currentUserName =
            User.FindFirstValue(
                ClaimTypes.Name
            );

        var currentUserEmail =
            User.FindFirstValue(
                ClaimTypes.Email
            );

        if (
            string.IsNullOrWhiteSpace(
                currentUserId
            )
        )
        {
            return Unauthorized();
        }

        message.UserId =
            currentUserId;

        if (
            !string.IsNullOrWhiteSpace(
                currentUserName
            )
        )
        {
            message.Name =
                currentUserName;
        }

        if (
            !string.IsNullOrWhiteSpace(
                currentUserEmail
            )
        )
        {
            message.Email =
                currentUserEmail;
        }

        var createdMessage =
            _supportMessageService
                .Create(message);

        return StatusCode(
            StatusCodes
                .Status201Created,
            createdMessage
        );
    }
}