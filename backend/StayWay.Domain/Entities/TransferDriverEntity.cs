namespace StayWay.Domain.Entities;

public class TransferDriverEntity
{
    public string Id { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Status { get; set; } = "available";
}