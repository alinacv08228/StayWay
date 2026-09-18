using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using StayWay.DataAccessLayer.Context;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class UserService : IUserService
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 100_000;

    private readonly AppDbContext _context;

    public UserService(
        AppDbContext context
    )
    {
        _context = context;
    }

    public List<UserDto> GetAll()
    {
        return _context.Users
            .AsNoTracking()
            .OrderBy(user => user.Id)
            .Select(user =>
                new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role
                }
            )
            .ToList();
    }

    public UserDto? GetById(
        string id
    )
    {
        var user =
            _context.Users
                .AsNoTracking()
                .FirstOrDefault(
                    item => item.Id == id
                );

        return user is null
            ? null
            : ToDto(user);
    }

    public UserDto? Login(
        LoginRequestDto request
    )
    {
        if (
            string.IsNullOrWhiteSpace(
                request.Email
            ) ||
            string.IsNullOrEmpty(
                request.Password
            )
        )
        {
            return null;
        }

        var normalizedEmail =
            request.Email
                .Trim()
                .ToLowerInvariant();

        var user =
            _context.Users
                .AsNoTracking()
                .FirstOrDefault(
                    item =>
                        item.Email.ToLower() ==
                        normalizedEmail
                );

        if (user is null)
        {
            return null;
        }

        if (
            !VerifyPassword(
                request.Password,
                user.PasswordHash,
                user.PasswordSalt
            )
        )
        {
            return null;
        }

        return ToDto(user);
    }

    public UserDto? Register(
        RegisterRequestDto request
    )
    {
        var firstName =
            request.FirstName.Trim();

        var lastName =
            request.LastName.Trim();

        var normalizedEmail =
            request.Email
                .Trim()
                .ToLowerInvariant();

        if (
            string.IsNullOrWhiteSpace(
                firstName
            ) ||
            string.IsNullOrWhiteSpace(
                lastName
            ) ||
            string.IsNullOrWhiteSpace(
                normalizedEmail
            )
        )
        {
            return null;
        }

        if (request.Password.Length < 6)
        {
            return null;
        }

        var emailAlreadyExists =
            _context.Users.Any(
                item =>
                    item.Email.ToLower() ==
                    normalizedEmail
            );

        if (emailAlreadyExists)
        {
            throw new InvalidOperationException(
                "An account with this email already exists."
            );
        }

        var salt =
            RandomNumberGenerator.GetBytes(
                SaltSize
            );

        var hash =
            HashPassword(
                request.Password,
                salt
            );

        var newUser =
            new UserEntity
            {
                Id = GenerateUserId(),

                Name =
                    $"{firstName} {lastName}",

                Email =
                    normalizedEmail,

                Role = "user",

                PasswordHash =
                    Convert.ToBase64String(hash),

                PasswordSalt =
                    Convert.ToBase64String(salt)
            };

        _context.Users.Add(newUser);

        try
        {
            _context.SaveChanges();
        }
        catch (DbUpdateException exception)
        {
            throw new InvalidOperationException(
                "An account with this email already exists.",
                exception
            );
        }

        return ToDto(newUser);
    }

    public bool Delete(
        string id
    )
    {
        var user =
            _context.Users
                .FirstOrDefault(
                    item => item.Id == id
                );

        if (user is null)
        {
            return false;
        }

        _context.Users.Remove(user);
        _context.SaveChanges();

        return true;
    }

    private string GenerateUserId()
    {
        string id;

        do
        {
            id =
                $"user-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        }
        while (
            _context.Users.Any(
                user => user.Id == id
            )
        );

        return id;
    }

    private static UserDto ToDto(
        UserEntity user
    )
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        };
    }

    private static byte[] HashPassword(
        string password,
        byte[] salt
    )
    {
        return Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            Iterations,
            HashAlgorithmName.SHA256,
            HashSize
        );
    }

    private static bool VerifyPassword(
        string password,
        string storedHash,
        string storedSalt
    )
    {
        try
        {
            var salt =
                Convert.FromBase64String(
                    storedSalt
                );

            var expectedHash =
                Convert.FromBase64String(
                    storedHash
                );

            var actualHash =
                HashPassword(
                    password,
                    salt
                );

            return CryptographicOperations
                .FixedTimeEquals(
                    actualHash,
                    expectedHash
                );
        }
        catch
        {
            return false;
        }
    }
}