namespace StayWay.Domain.Entities;

public class TransferBookingEntity
{
    public string Id { get; set; } = string.Empty;

    public string TransferType { get; set; } = string.Empty;

    public string OptionId { get; set; } = string.Empty;

    public string OptionTitle { get; set; } = string.Empty;

    public double Price { get; set; }

    public string? VehicleId { get; set; }

    public string? VehicleName { get; set; }

    public string? LicensePlate { get; set; }

    public string? DriverId { get; set; }

    public string? DriverName { get; set; }

    public string Pickup { get; set; } = string.Empty;

    public string Destination { get; set; } = string.Empty;

    public string Date { get; set; } = string.Empty;

    public string Time { get; set; } = string.Empty;

    public int Passengers { get; set; }

    public string? ReturnDate { get; set; }

    public string? ReturnTime { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string SpecialRequests { get; set; } = string.Empty;

    public string Status { get; set; } = "pending";

    public string CreatedAt { get; set; } = string.Empty;
}