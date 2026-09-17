using Microsoft.AspNetCore.Mvc;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpGet]
    public ActionResult<List<BookingDto>> GetAll()
    {
        return Ok(_bookingService.GetAll());
    }

    [HttpGet("{id:long}")]
    public ActionResult<BookingDto> GetById(long id)
    {
        var booking = _bookingService.GetById(id);

        if (booking is null)
        {
            return NotFound();
        }

        return Ok(booking);
    }

    [HttpGet("user/{userId}")]
    public ActionResult<List<BookingDto>> GetByUserId(string userId)
    {
        return Ok(_bookingService.GetByUserId(userId));
    }

    [HttpGet("availability")]
    public ActionResult<bool> CheckAvailability(
        [FromQuery] int propertyId,
        [FromQuery] int roomId,
        [FromQuery] string checkIn,
        [FromQuery] string checkOut)
    {
        var isAvailable = _bookingService.IsRoomAvailable(
            propertyId,
            roomId,
            checkIn,
            checkOut
        );

        return Ok(isAvailable);
    }

    [HttpPost]
    public ActionResult<BookingDto> Create(BookingDto booking)
    {
        try
        {
            var createdBooking = _bookingService.Create(booking);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdBooking.Id },
                createdBooking
            );
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    [HttpPut("{id:long}")]
    public ActionResult<BookingDto> Update(
        long id,
        BookingDto booking)
    {
        try
        {
            var updatedBooking =
                _bookingService.Update(id, booking);

            if (updatedBooking is null)
            {
                return NotFound();
            }

            return Ok(updatedBooking);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    [HttpDelete("{id:long}")]
    public IActionResult Delete(long id)
    {
        var deleted = _bookingService.Delete(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}