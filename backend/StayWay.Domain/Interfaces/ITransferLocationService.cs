using StayWay.Domain.DTOs;

namespace StayWay.Domain.Interfaces;

public interface ITransferLocationService
{
    List<TransferLocationDto> GetAll();

    List<TransferLocationDto> GetByCity(
        string city
    );
}