using StayWay.Domain.DTOs;

namespace StayWay.Domain.Interfaces;

public interface IUserService
{
    List<UserDto> GetAll();

    UserDto? GetById(string id);

    UserDto? Login(LoginRequestDto request);

    UserDto? Register(RegisterRequestDto request);

    bool Delete(string id);
}