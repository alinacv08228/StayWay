using System.Text.Json;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class SupportMessageService : ISupportMessageService
{
    private readonly string _filePath;

    private readonly List<SupportMessageEntity>
        _messages;

    private readonly object _sync = new();

    private static readonly JsonSerializerOptions
        JsonOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy =
                JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

    public SupportMessageService(
        string filePath
    )
    {
        _filePath = filePath;

        var directory =
            Path.GetDirectoryName(
                _filePath
            );

        if (
            !string.IsNullOrWhiteSpace(
                directory
            )
        )
        {
            Directory.CreateDirectory(
                directory
            );
        }

        _messages =
            LoadMessages();
    }

    public List<SupportMessageDto> GetAll()
    {
        lock (_sync)
        {
            return _messages
                .OrderByDescending(
                    item =>
                        item.CreatedAt
                )
                .Select(ToDto)
                .ToList();
        }
    }

    public SupportMessageDto Create(
        SupportMessageDto message
    )
    {
        lock (_sync)
        {
            var entity =
                new SupportMessageEntity
                {
                    Id =
                        GetNextId(),

                    UserId =
                        message.UserId.Trim(),

                    Name =
                        message.Name.Trim(),

                    Email =
                        message.Email.Trim(),

                    Subject =
                        message.Subject.Trim(),

                    Message =
                        message.Message.Trim(),

                    Status =
                        "new",

                    CreatedAt =
                        DateTime.UtcNow
                };

            _messages.Add(entity);

            SaveMessages();

            return ToDto(entity);
        }
    }

    private long GetNextId()
    {
        if (_messages.Count == 0)
        {
            return 1;
        }

        return _messages.Max(
            item => item.Id
        ) + 1;
    }

    private List<SupportMessageEntity>
        LoadMessages()
    {
        if (!File.Exists(_filePath))
        {
            File.WriteAllText(
                _filePath,
                "[]"
            );

            return [];
        }

        try
        {
            var json =
                File.ReadAllText(
                    _filePath
                );

            return JsonSerializer
                .Deserialize<
                    List<SupportMessageEntity>
                >(
                    json,
                    JsonOptions
                ) ?? [];
        }
        catch
        {
            return [];
        }
    }

    private void SaveMessages()
    {
        var json =
            JsonSerializer.Serialize(
                _messages,
                JsonOptions
            );

        File.WriteAllText(
            _filePath,
            json
        );
    }

    private static SupportMessageDto ToDto(
        SupportMessageEntity message
    )
    {
        return new SupportMessageDto
        {
            Id =
                message.Id,

            UserId =
                message.UserId,

            Name =
                message.Name,

            Email =
                message.Email,

            Subject =
                message.Subject,

            Message =
                message.Message,

            Status =
                message.Status,

            CreatedAt =
                message.CreatedAt
        };
    }
}