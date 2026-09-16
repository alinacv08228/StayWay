namespace StayWay.Domain.Entities;

public class PropertyEntity
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public long DestinationId { get; set; }

    public string Address { get; set; } = string.Empty;

    public int Stars { get; set; }

    public double Rating { get; set; }

    public decimal PricePerNight { get; set; }

    public string Image { get; set; } = string.Empty;
}