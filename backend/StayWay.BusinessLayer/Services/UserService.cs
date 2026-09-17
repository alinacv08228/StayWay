using System.Security.Cryptography;
using System.Text.Json;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class UserService : IUserService
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 100_000;

    private readonly string _dataPath;
    private readonly object _fileLock = new();

    private readonly JsonSerializerOptions _jsonOptions =
        new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

    public UserService(string dataPath)
    {
        _dataPath = dataPath;

        var directory = Path.GetDirectoryName(_dataPath);

        if (!string.IsNullOrWhiteSpace(directory))
        {
            Directory.CreateDirectory(directory);
        }

        if (!File.Exists(_dataPath))
        {
            File.WriteAllText(_dataPath, "[]");
        }
    }

    public List<UserDto> GetAll()
    {
        lock (_fileLock)
        {
            return LoadUsers()
                .Select(ToDto)
                .ToList();
        }
    }

    public UserDto? GetById(string id)
    {
        lock (_fileLock)
        {
            var user = LoadUsers()
                .FirstOrDefault(
                    item => item.Id == id
                );

            return user is null
                ? null
                : ToDto(user);
        }
    }

    public UserDto? Login(LoginRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrEmpty(request.Password))
        {
            return null;
        }

        var normalizedEmail =
            request.Email
                .Trim()
                .ToLowerInvariant();

        lock (_fileLock)
        {
            var user = LoadUsers()
                .FirstOrDefault(
                    item =>
                        item.Email
                            .Trim()
                            .ToLowerInvariant() ==
                        normalizedEmail
                );

            if (user is null)
            {
                return null;
            }

            if (!VerifyPassword(
                    request.Password,
                    user.PasswordHash,
                    user.PasswordSalt
                ))
            {
                return null;
            }

            return ToDto(user);
        }
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

        if (string.IsNullOrWhiteSpace(firstName) ||
            string.IsNullOrWhiteSpace(lastName) ||
            string.IsNullOrWhiteSpace(normalizedEmail))
        {
            return null;
        }

        if (request.Password.Length < 6)
        {
            return null;
        }

        lock (_fileLock)
        {
            var users = LoadUsers();

            var emailAlreadyExists =
                users.Any(
                    item =>
                        item.Email
                            .Trim()
                            .ToLowerInvariant() ==
                        normalizedEmail
                );

            if (emailAlreadyExists)
            {
                return null;
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

            var newUser = new UserEntity
            {
                Id = GenerateUserId(users),

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

            users.Add(newUser);

            SaveUsers(users);

            return ToDto(newUser);
        }
    }

    public bool Delete(string id)
    {
        lock (_fileLock)
        {
            var users = LoadUsers();

            var user =
                users.FirstOrDefault(
                    item => item.Id == id
                );

            if (user is null)
            {
                return false;
            }

            users.Remove(user);

            SaveUsers(users);

            return true;
        }
    }

    private List<UserEntity> LoadUsers()
    {
        if (!File.Exists(_dataPath))
        {
            return [];
        }

        var json =
            File.ReadAllText(_dataPath);

        if (string.IsNullOrWhiteSpace(json))
        {
            return [];
        }

        return JsonSerializer.Deserialize<
                   List<UserEntity>
               >(
                   json,
                   _jsonOptions
               )
               ?? [];
    }

    private void SaveUsers(
        List<UserEntity> users
    )
    {
        var json =
            JsonSerializer.Serialize(
                users,
                _jsonOptions
            );

        File.WriteAllText(
            _dataPath,
            json
        );
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

    private static string GenerateUserId(
        List<UserEntity> users
    )
    {
        string id;

        do
        {
            id =
                $"user-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        }
        while (
            users.Any(
                user => user.Id == id
            )
        );

        return id;
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