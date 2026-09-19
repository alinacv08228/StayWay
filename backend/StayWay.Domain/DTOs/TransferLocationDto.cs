namespace StayWay.Domain.DTOs;

public class TransferLocationDto
{
    public string Id { get; set; } = string.Empty;

    public long CityId { get; set; }

    public string CityName { get; set; } = string.Empty;

    public string Type { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string? Code { get; set; }

    public List<string> SearchTerms { get; set; } = [];
}