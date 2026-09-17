using StayWay.Domain.DTOs;

namespace StayWay.Domain.Interfaces;

public interface ITransferVehicleService
{
    List<TransferVehicleDto> GetAll();

    TransferVehicleDto? GetById(string id);

    List<TransferVehicleDto> GetByCity(string city);

    TransferVehicleDto Create(TransferVehicleDto vehicle);

    TransferVehicleDto? Update(
        string id,
        TransferVehicleDto vehicle
    );

    bool Delete(string id);
}