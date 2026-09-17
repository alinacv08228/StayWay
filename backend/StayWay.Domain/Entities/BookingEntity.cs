namespace StayWay.Domain.Entities;

public class BookingEntity
{
    public long Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public int PropertyId { get; set; }

    public int? RoomId { get; set; }

    public string CheckIn { get; set; } = string.Empty;

    public string CheckOut { get; set; } = string.Empty;

    public int Adults { get; set; }

    public int Children { get; set; }

    public int Infants { get; set; }

    public int Guests { get; set; }

    public decimal TotalPrice { get; set; }

    public string Status { get; set; } = "pending";

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string SpecialRequests { get; set; } = string.Empty;
}