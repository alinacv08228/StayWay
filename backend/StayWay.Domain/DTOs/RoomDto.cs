namespace StayWay.Domain.DTOs;

public class RoomDto
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Guests { get; set; }
    public string Size { get; set; } = string.Empty;
    public string Bed { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public string Image { get; set; } = string.Empty;
    public List<string> Features { get; set; } = [];
    public bool FreeCancellation { get; set; } = true;
    public bool NoPrepayment { get; set; } = true;
}