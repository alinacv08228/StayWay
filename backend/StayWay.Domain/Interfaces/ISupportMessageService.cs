using StayWay.Domain.DTOs;

namespace StayWay.Domain.Interfaces;

public interface ISupportMessageService
{
    List<SupportMessageDto> GetAll();

    SupportMessageDto Create(
        SupportMessageDto message
    );
}