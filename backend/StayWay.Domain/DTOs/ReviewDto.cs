namespace StayWay.Domain.DTOs;

public class ReviewDto
{
    public int Id { get; set; }

    public int PropertyId { get; set; }

    public string? UserId { get; set; }

    public string UserName { get; set; } = string.Empty;

    public int Rating { get; set; }

    public string Comment { get; set; } = string.Empty;

    public string CreatedAt { get; set; } = string.Empty;

    public bool IsMock { get; set; }
}