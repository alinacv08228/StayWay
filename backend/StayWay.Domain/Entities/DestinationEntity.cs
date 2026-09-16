namespace StayWay.Domain.Entities;

public class DestinationEntity
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string CountryImage { get; set; } = string.Empty;
}