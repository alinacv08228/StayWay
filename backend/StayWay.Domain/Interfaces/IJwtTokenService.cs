using StayWay.Domain.DTOs;

namespace StayWay.Domain.Interfaces;

public interface IJwtTokenService
{
    AuthResponseDto CreateToken(
        UserDto user
    );
}