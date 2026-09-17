namespace StayWay.Domain.DTOs;

public class TransferVehicleDto
{
    public string Id { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string LicensePlate { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public int Passengers { get; set; }

    public int Luggage { get; set; }

    public string Image { get; set; } = string.Empty;

    public string? DriverId { get; set; }
}