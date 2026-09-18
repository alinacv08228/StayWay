using StayWay.Domain.DTOs;

namespace StayWay.Domain.Interfaces;

public interface ITransferBookingService
{
    List<TransferBookingDto> GetAll();

    TransferBookingDto? GetById(
        string id
    );

    List<TransferBookingDto> GetByDriverId(
        string driverId
    );

    TransferBookingDto Create(
        TransferBookingDto booking
    );

    TransferBookingDto? Update(
        string id,
        TransferBookingDto booking
    );

    bool Delete(
        string id
    );
}