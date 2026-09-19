using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class JwtTokenService
    : IJwtTokenService
{
    private readonly IConfiguration
        _configuration;

    public JwtTokenService(
        IConfiguration configuration
    )
    {
        _configuration =
            configuration;
    }

    public AuthResponseDto CreateToken(
        UserDto user
    )
    {
        var jwtKey =
            _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "JWT key was not configured."
            );

        var issuer =
            _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException(
                "JWT issuer was not configured."
            );

        var audience =
            _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException(
                "JWT audience was not configured."
            );

        var expirationMinutes =
            int.TryParse(
                _configuration[
                    "Jwt:ExpirationMinutes"
                ],
                out var configuredExpirationMinutes
            )
                ? configuredExpirationMinutes
                : 120;

        var expiresAt =
            DateTime.UtcNow.AddMinutes(
                expirationMinutes
            );

        var claims =
            new List<Claim>
            {
                new(
                    ClaimTypes.NameIdentifier,
                    user.Id
                ),

                new(
                    ClaimTypes.Name,
                    user.Name
                ),

                new(
                    ClaimTypes.Email,
                    user.Email
                ),

                new(
                    ClaimTypes.Role,
                    user.Role
                )
            };

        var securityKey =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    jwtKey
                )
            );

        var credentials =
            new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256
            );

        var token =
            new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: expiresAt,
                signingCredentials: credentials
            );

        return new AuthResponseDto
        {
            Token =
                new JwtSecurityTokenHandler()
                    .WriteToken(token),

            ExpiresAt =
                expiresAt,

            User =
                user
        };
    }
}