using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StayWay.API.Services;
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

    private readonly EmailService
        _emailService;

    private readonly ILogger<SupportMessagesController>
        _logger;

    public SupportMessagesController(
        ISupportMessageService supportMessageService,
        EmailService emailService,
        ILogger<SupportMessagesController> logger
    )
    {
        _supportMessageService =
            supportMessageService;

        _emailService =
            emailService;

        _logger =
            logger;
    }

    [Authorize(Roles = "admin")]
    [HttpGet]
    public ActionResult<List<SupportMessageDto>>
        GetAll()
    {
        return Ok(
            _supportMessageService.GetAll()
        );
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<SupportMessageDto>>
        Create(
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
            ) ||
            string.IsNullOrWhiteSpace(
                currentUserEmail
            )
        )
        {
            return Unauthorized();
        }

        if (
            string.IsNullOrWhiteSpace(
                message.Subject
            )
        )
        {
            return BadRequest(
                new
                {
                    message =
                        "Subject is required."
                }
            );
        }

        if (
            string.IsNullOrWhiteSpace(
                message.Message
            )
        )
        {
            return BadRequest(
                new
                {
                    message =
                        "Message is required."
                }
            );
        }

        message.UserId =
            currentUserId;

        message.Name =
            string.IsNullOrWhiteSpace(
                currentUserName
            )
                ? "StayWay user"
                : currentUserName;

        message.Email =
            currentUserEmail;

        try
        {
            await _emailService
                .SendSupportMessageAsync(
                    message
                );
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "StayWay support email could not be sent."
            );

            return StatusCode(
                StatusCodes.Status502BadGateway,
                new
                {
                    message =
                        "The support email could not be sent."
                }
            );
        }

        var createdMessage =
            _supportMessageService
                .Create(message);

        return StatusCode(
            StatusCodes.Status201Created,
            createdMessage
        );
    }
}