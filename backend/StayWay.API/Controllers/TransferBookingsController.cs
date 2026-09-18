using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransferBookingsController
    : ControllerBase
{
    private readonly ITransferBookingService
        _transferBookingService;

    public TransferBookingsController(
        ITransferBookingService transferBookingService
    )
    {
        _transferBookingService =
            transferBookingService;
    }

    [Authorize]
    [HttpGet]
    public ActionResult<List<TransferBookingDto>>
        GetAll()
    {
        var currentUserId =
            GetCurrentUserId();

        if (currentUserId is null)
        {
            return Unauthorized();
        }

        var bookings =
            _transferBookingService.GetAll();

        if (IsAdmin())
        {
            return Ok(bookings);
        }

        var userBookings =
            bookings
                .Where(
                    booking =>
                        booking.UserId ==
                        currentUserId
                )
                .ToList();

        return Ok(userBookings);
    }

    [Authorize]
    [HttpGet("{id}")]
    public ActionResult<TransferBookingDto>
        GetById(
            string id
        )
    {
        var booking =
            _transferBookingService.GetById(
                id
            );

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

    [Authorize(Roles = "admin")]
    [HttpGet("driver/{driverId}")]
    public ActionResult<List<TransferBookingDto>>
        GetByDriverId(
            string driverId
        )
    {
        return Ok(
            _transferBookingService
                .GetByDriverId(driverId)
        );
    }

    [Authorize]
    [HttpPost]
    public ActionResult<TransferBookingDto>
        Create(
            TransferBookingDto booking
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

        booking.CreatedAt =
            string.Empty;

        var validationError =
            ValidateBooking(booking);

        if (validationError is not null)
        {
            return BadRequest(
                new
                {
                    message =
                        validationError
                }
            );
        }

        if (
            !string.IsNullOrWhiteSpace(
                booking.Id
            ) &&
            _transferBookingService
                .GetById(booking.Id) is not null
        )
        {
            return Conflict(
                new
                {
                    message =
                        "A transfer booking with this ID already exists."
                }
            );
        }

        var createdBooking =
            _transferBookingService.Create(
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

    [Authorize]
    [HttpPut("{id}")]
    public ActionResult<TransferBookingDto>
        Update(
            string id,
            TransferBookingDto booking
        )
    {
        var existingBooking =
            _transferBookingService.GetById(
                id
            );

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

            var validationError =
                ValidateBooking(booking);

            if (validationError is not null)
            {
                return BadRequest(
                    new
                    {
                        message =
                            validationError
                    }
                );
            }

            var updatedBooking =
                _transferBookingService.Update(
                    id,
                    booking
                );

            if (updatedBooking is null)
            {
                return NotFound();
            }

            return Ok(updatedBooking);
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
                        "Users can only cancel their own transfer bookings."
                }
            );
        }

        existingBooking.Status =
            "cancelled";

        var cancelledBooking =
            _transferBookingService.Update(
                id,
                existingBooking
            );

        if (cancelledBooking is null)
        {
            return NotFound();
        }

        return Ok(cancelledBooking);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id}")]
    public IActionResult Delete(
        string id
    )
    {
        var deleted =
            _transferBookingService.Delete(
                id
            );

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

    private static string? ValidateBooking(
        TransferBookingDto booking
    )
    {
        var allowedTransferTypes =
            new[]
            {
                "one-way",
                "return"
            };

        if (
            !allowedTransferTypes.Contains(
                booking.TransferType,
                StringComparer.OrdinalIgnoreCase
            )
        )
        {
            return
                "Transfer type must be one-way or return.";
        }

        if (
            string.IsNullOrWhiteSpace(
                booking.OptionId
            )
        )
        {
            return "Option is required.";
        }

        if (
            string.IsNullOrWhiteSpace(
                booking.OptionTitle
            )
        )
        {
            return
                "Option title is required.";
        }

        var allowedOptionTitles =
            new[]
            {
                "Private transfer",
                "Comfort transfer",
                "Family transfer"
            };

        if (
            !allowedOptionTitles.Contains(
                booking.OptionTitle,
                StringComparer.OrdinalIgnoreCase
            )
        )
        {
            return
                "Option title must be Private transfer, Comfort transfer, or Family transfer.";
        }

        if (booking.Price < 0)
        {
            return
                "Price cannot be negative.";
        }

        if (
            string.IsNullOrWhiteSpace(
                booking.Pickup
            )
        )
        {
            return "Pickup is required.";
        }

        if (
            string.IsNullOrWhiteSpace(
                booking.Destination
            )
        )
        {
            return
                "Destination is required.";
        }

        if (
            string.IsNullOrWhiteSpace(
                booking.Date
            )
        )
        {
            return "Date is required.";
        }

        if (
            string.IsNullOrWhiteSpace(
                booking.Time
            )
        )
        {
            return "Time is required.";
        }

        if (booking.Passengers <= 0)
        {
            return
                "Passengers must be greater than zero.";
        }

        if (
            booking.TransferType.Equals(
                "return",
                StringComparison.OrdinalIgnoreCase
            ) &&
            (
                string.IsNullOrWhiteSpace(
                    booking.ReturnDate
                ) ||
                string.IsNullOrWhiteSpace(
                    booking.ReturnTime
                )
            )
        )
        {
            return
                "Return date and return time are required for return transfers.";
        }

        if (
            string.IsNullOrWhiteSpace(
                booking.FirstName
            )
        )
        {
            return
                "First name is required.";
        }

        if (
            string.IsNullOrWhiteSpace(
                booking.LastName
            )
        )
        {
            return
                "Last name is required.";
        }

        if (
            string.IsNullOrWhiteSpace(
                booking.Email
            )
        )
        {
            return "Email is required.";
        }

        if (
            string.IsNullOrWhiteSpace(
                booking.Phone
            )
        )
        {
            return "Phone is required.";
        }

        var allowedStatuses =
            new[]
            {
                "pending",
                "confirmed",
                "cancelled"
            };

        if (
            !string.IsNullOrWhiteSpace(
                booking.Status
            ) &&
            !allowedStatuses.Contains(
                booking.Status,
                StringComparer.OrdinalIgnoreCase
            )
        )
        {
            return
                "Status must be pending, confirmed, or cancelled.";
        }

        return null;
    }
}