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
            CreateSupportMessageRequestDto request
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
                request.Subject
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
                request.Message
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

        var message =
            new SupportMessageDto
            {
                UserId =
                    currentUserId,

                Name =
                    string.IsNullOrWhiteSpace(
                        currentUserName
                    )
                        ? "StayWay user"
                        : currentUserName,

                Email =
                    currentUserEmail,

                Subject =
                    request.Subject.Trim(),

                Message =
                    request.Message.Trim()
            };

        /*
         * Save the support request first.
         * A temporary email problem must not
         * cause the user's message to be lost.
         */
        var createdMessage =
            _supportMessageService
                .Create(message);

        try
        {
            await _emailService
                .SendSupportMessageAsync(
                    createdMessage
                );
        }
        catch (Exception exception)
        {
            _logger.LogError(
                exception,
                "StayWay support email could not be sent for support message {SupportMessageId}.",
                createdMessage.Id
            );
        }

        return StatusCode(
            StatusCodes.Status201Created,
            createdMessage
        );
    }
}