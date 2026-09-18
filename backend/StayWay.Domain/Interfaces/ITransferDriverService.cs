using StayWay.Domain.DTOs;

namespace StayWay.Domain.Interfaces;

public interface ITransferDriverService
{
    List<TransferDriverDto> GetAll();

    TransferDriverDto? GetById(string id);

    List<TransferDriverDto> GetByCity(string city);

    TransferDriverDto Create(TransferDriverDto driver);

    TransferDriverDto? Update(
        string id,
        TransferDriverDto driver
    );

    bool Delete(string id);
}