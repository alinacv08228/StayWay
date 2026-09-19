namespace StayWay.Domain.Entities;

public class AirportEntity
{
    public string Id { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public List<string> SearchTerms { get; set; } = [];
}