namespace StayWay.Domain.DTOs;

public class TransferDriverDto
{
    public string Id { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Status { get; set; } = "available";
}