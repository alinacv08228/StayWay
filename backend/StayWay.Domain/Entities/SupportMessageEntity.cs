namespace StayWay.Domain.Entities;

public class SupportMessageEntity
{
    public long Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Subject { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public string Status { get; set; } = "new";

    public DateTime CreatedAt { get; set; }
}