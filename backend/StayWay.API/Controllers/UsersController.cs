using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService
        _userService;

    private readonly IJwtTokenService
        _jwtTokenService;

    public UsersController(
        IUserService userService,
        IJwtTokenService jwtTokenService
    )
    {
        _userService =
            userService;

        _jwtTokenService =
            jwtTokenService;
    }

    [Authorize(Roles = "admin")]
    [HttpGet]
    public ActionResult<List<UserDto>>
        GetAll()
    {
        return Ok(
            _userService.GetAll()
        );
    }

    [Authorize]
    [HttpGet("{id}")]
    public ActionResult<UserDto>
        GetById(
            string id
        )
    {
        var currentUserId =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (
            string.IsNullOrWhiteSpace(
                currentUserId
            )
        )
        {
            return Unauthorized();
        }

        if (
            !User.IsInRole("admin") &&
            currentUserId != id
        )
        {
            return Forbid();
        }

        var user =
            _userService.GetById(id);

        if (user is null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost("login")]
    public ActionResult<AuthResponseDto>
        Login(
            LoginRequestDto request
        )
    {
        var user =
            _userService.Login(request);

        if (user is null)
        {
            return Unauthorized(
                new
                {
                    message =
                        "Invalid email or password."
                }
            );
        }

        var response =
            _jwtTokenService
                .CreateToken(user);

        return Ok(response);
    }

    [HttpPost("register")]
    public ActionResult<UserDto>
        Register(
            RegisterRequestDto request
        )
    {
        try
        {
            var user =
                _userService.Register(
                    request
                );

            if (user is null)
            {
                return BadRequest(
                    new
                    {
                        message =
                            "Could not create the account. Please check the submitted data."
                    }
                );
            }

            return CreatedAtAction(
                nameof(GetById),
                new
                {
                    id = user.Id
                },
                user
            );
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

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public IActionResult Delete(
        string id
    )
    {
        var deleted =
            _userService.Delete(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}