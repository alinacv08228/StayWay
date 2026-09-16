using Microsoft.AspNetCore.Mvc;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomsController(IRoomService roomService)
    {
        _roomService = roomService;
    }

    [HttpGet]
    public ActionResult<List<RoomDto>> GetAll()
    {
        return Ok(_roomService.GetAll());
    }

    [HttpGet("{id:int}")]
    public ActionResult<RoomDto> GetById(int id)
    {
        var room = _roomService.GetById(id);

        if (room is null)
        {
            return NotFound();
        }

        return Ok(room);
    }

    [HttpGet("property/{propertyId:int}")]
    public ActionResult<List<RoomDto>> GetByPropertyId(int propertyId)
    {
        return Ok(_roomService.GetByPropertyId(propertyId));
    }

    [HttpPost]
    public ActionResult<RoomDto> Create(RoomDto room)
    {
        var createdRoom = _roomService.Create(room);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdRoom.Id },
            createdRoom
        );
    }

    [HttpPut("{id:int}")]
    public ActionResult<RoomDto> Update(int id, RoomDto room)
    {
        var updatedRoom = _roomService.Update(id, room);

        if (updatedRoom is null)
        {
            return NotFound();
        }

        return Ok(updatedRoom);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        var deleted = _roomService.Delete(id);

        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}