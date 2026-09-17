using StayWay.Domain.DTOs;

namespace StayWay.Domain.Interfaces;

public interface IBookingService
{
    List<BookingDto> GetAll();

    BookingDto? GetById(long id);

    List<BookingDto> GetByUserId(string userId);

    BookingDto Create(BookingDto booking);

    BookingDto? Update(long id, BookingDto booking);

    bool Delete(long id);

    bool IsRoomAvailable(
        int propertyId,
        int roomId,
        string checkIn,
        string checkOut,
        long? excludeBookingId = null
    );
}