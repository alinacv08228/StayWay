using System.ComponentModel.DataAnnotations;

namespace StayWay.Domain.DTOs;

public class SupportMessageDto
{
    public long Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Subject { get; set; } = string.Empty;

    [Required]
    [MaxLength(5000)]
    public string Message { get; set; } = string.Empty;

    public string Status { get; set; } = "new";

    public DateTime CreatedAt { get; set; }
}