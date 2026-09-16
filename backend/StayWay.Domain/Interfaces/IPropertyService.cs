using StayWay.Domain.DTOs;

namespace StayWay.Domain.Interfaces;

public interface IPropertyService
{
    List<PropertyDto> GetAll();

    PropertyDto? GetById(int id);

    PropertyDto Create(PropertyDto property);

    PropertyDto? Update(
        int id,
        PropertyDto property
    );

    bool Delete(int id);
}