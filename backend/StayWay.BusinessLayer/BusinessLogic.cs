using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer;

public class BusinessLogic
{
    public IPropertyService Properties { get; }

    public BusinessLogic(
        IPropertyService propertyService
    )
    {
        Properties = propertyService;
    }
}