namespace StayWay.Domain.DTOs;

public class CreateSupportMessageRequestDto
{
    public string Subject { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}
