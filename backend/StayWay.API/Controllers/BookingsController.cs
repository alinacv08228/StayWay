using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService
        _bookingService;

    public BookingsController(
        IBookingService bookingService
    )
    {
        _bookingService =
            bookingService;
    }

    [Authorize(Roles = "admin")]
    [HttpGet]
    public ActionResult<List<BookingDto>>
        GetAll()
    {
        return Ok(
            _bookingService.GetAll()
        );
    }

    [Authorize]
    [HttpGet("{id:long}")]
    public ActionResult<BookingDto>
        GetById(
            long id
        )
    {
        var booking =
            _bookingService.GetById(id);

        if (booking is null)
        {
            return NotFound();
        }

        var currentUserId =
            GetCurrentUserId();

        if (currentUserId is null)
        {
            return Unauthorized();
        }

        if (
            !IsAdmin() &&
            booking.UserId != currentUserId
        )
        {
            return Forbid();
        }

        return Ok(booking);
    }

    [Authorize]
    [HttpGet("user/{userId}")]
    public ActionResult<List<BookingDto>>
        GetByUserId(
            string userId
        )
    {
        var currentUserId =
            GetCurrentUserId();

        if (currentUserId is null)
        {
            return Unauthorized();
        }

        if (
            !IsAdmin() &&
            userId != currentUserId
        )
        {
            return Forbid();
        }

        return Ok(
            _bookingService.GetByUserId(
                userId
            )
        );
    }

    [HttpGet("availability")]
    public ActionResult<bool>
        CheckAvailability(
            [FromQuery] int propertyId,
            [FromQuery] int roomId,
            [FromQuery] string checkIn,
            [FromQuery] string checkOut
        )
    {
        var isAvailable =
            _bookingService
                .IsRoomAvailable(
                    propertyId,
                    roomId,
                    checkIn,
                    checkOut
                );

        return Ok(isAvailable);
    }

    [Authorize]
    [HttpPost]
    public ActionResult<BookingDto>
        Create(
            BookingDto booking
        )
    {
        var currentUserId =
            GetCurrentUserId();

        if (currentUserId is null)
        {
            return Unauthorized();
        }

        booking.UserId =
            currentUserId;

        if (!IsAdmin())
        {
            booking.Status =
                "pending";
        }

        try
        {
            var createdBooking =
                _bookingService.Create(
                    booking
                );

            return CreatedAtAction(
                nameof(GetById),
                new
                {
                    id = createdBooking.Id
                },
                createdBooking
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

    [Authorize]
    [HttpPut("{id:long}")]
    public ActionResult<BookingDto>
        Update(
            long id,
            BookingDto booking
        )
    {
        var existingBooking =
            _bookingService.GetById(id);

        if (existingBooking is null)
        {
            return NotFound();
        }

        var currentUserId =
            GetCurrentUserId();

        if (currentUserId is null)
        {
            return Unauthorized();
        }

        if (IsAdmin())
        {
            booking.UserId =
                existingBooking.UserId;

            try
            {
                var updatedBooking =
                    _bookingService.Update(
                        id,
                        booking
                    );

                if (updatedBooking is null)
                {
                    return NotFound();
                }

                return Ok(updatedBooking);
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

        if (
            existingBooking.UserId !=
            currentUserId
        )
        {
            return Forbid();
        }

        if (
            !string.Equals(
                booking.Status,
                "cancelled",
                StringComparison.OrdinalIgnoreCase
            )
        )
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new
                {
                    message =
                        "Users can only cancel their own bookings."
                }
            );
        }

        existingBooking.Status =
            "cancelled";

        try
        {
            var cancelledBooking =
                _bookingService.Update(
                    id,
                    existingBooking
                );

            if (cancelledBooking is null)
            {
                return NotFound();
            }

            return Ok(cancelledBooking);
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

    [Authorize]
    [HttpDelete("{id:long}")]
    public IActionResult Delete(
        long id
    )
    {
        var booking =
            _bookingService.GetById(id);

        if (booking is null)
        {
            return NotFound();
        }

        var currentUserId =
            GetCurrentUserId();

        if (currentUserId is null)
        {
            return Unauthorized();
        }

        if (
            !IsAdmin() &&
            booking.UserId != currentUserId
        )
        {
            return Forbid();
        }

        var deleted =
            _bookingService.Delete(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
    }

    private bool IsAdmin()
    {
        return User.IsInRole("admin");
    }
}