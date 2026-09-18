using Microsoft.EntityFrameworkCore;
using StayWay.DataAccessLayer.Context;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class SupportMessageService : ISupportMessageService
{
    private readonly AppDbContext _context;

    public SupportMessageService(
        AppDbContext context
    )
    {
        _context = context;
    }

    public List<SupportMessageDto> GetAll()
    {
        return _context.SupportMessages
            .AsNoTracking()
            .OrderByDescending(
                message => message.CreatedAt
            )
            .Select(message =>
                new SupportMessageDto
                {
                    Id = message.Id,
                    UserId = message.UserId,
                    Name = message.Name,
                    Email = message.Email,
                    Subject = message.Subject,
                    Message = message.Message,
                    Status = message.Status,
                    CreatedAt = message.CreatedAt
                }
            )
            .ToList();
    }

    public SupportMessageDto Create(
        SupportMessageDto message
    )
    {
        var entity =
            new SupportMessageEntity
            {
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

                Status = "new",

                CreatedAt =
                    DateTime.UtcNow
            };

        _context.SupportMessages.Add(entity);
        _context.SaveChanges();

        return ToDto(entity);
    }

    private static SupportMessageDto ToDto(
        SupportMessageEntity message
    )
    {
        return new SupportMessageDto
        {
            Id = message.Id,
            UserId = message.UserId,
            Name = message.Name,
            Email = message.Email,
            Subject = message.Subject,
            Message = message.Message,
            Status = message.Status,
            CreatedAt = message.CreatedAt
        };
    }
}
