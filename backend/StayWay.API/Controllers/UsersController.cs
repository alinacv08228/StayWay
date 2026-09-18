using Microsoft.AspNetCore.Mvc;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(
        IUserService userService
    )
    {
        _userService = userService;
    }

    [HttpGet]
    public ActionResult<List<UserDto>>
        GetAll()
    {
        return Ok(
            _userService.GetAll()
        );
    }

    [HttpGet("{id}")]
    public ActionResult<UserDto>
        GetById(
            string id
        )
    {
        var user =
            _userService.GetById(id);

        if (user is null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpPost("login")]
    public ActionResult<UserDto>
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

        return Ok(user);
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
                _userService.Register(request);

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
        catch (InvalidOperationException exception)
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