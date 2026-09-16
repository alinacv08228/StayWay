using StayWay.Domain.DTOs;

namespace StayWay.Domain.Interfaces;

public interface IDestinationService
{
    List<DestinationDto> GetAll();
    DestinationDto? GetById(long id);
    DestinationDto Create(DestinationDto destination);
    DestinationDto? Update(long id, DestinationDto destination);
    bool Delete(long id);
}