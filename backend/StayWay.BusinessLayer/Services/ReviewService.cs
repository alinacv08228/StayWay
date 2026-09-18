using Microsoft.EntityFrameworkCore;
using StayWay.DataAccessLayer.Context;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class ReviewService : IReviewService
{
    private readonly AppDbContext _context;

    public ReviewService(
        AppDbContext context
    )
    {
        _context = context;
    }

    public List<ReviewDto> GetAll()
    {
        return _context.Reviews
            .AsNoTracking()
            .OrderBy(review => review.Id)
            .Select(review =>
                new ReviewDto
                {
                    Id = review.Id,
                    PropertyId = review.PropertyId,
                    UserId = review.UserId,
                    UserName = review.UserName,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    CreatedAt = review.CreatedAt,
                    IsMock = review.IsMock
                }
            )
            .ToList();
    }

    public ReviewDto? GetById(
        int id
    )
    {
        var review =
            _context.Reviews
                .AsNoTracking()
                .FirstOrDefault(
                    item => item.Id == id
                );

        return review is null
            ? null
            : ToDto(review);
    }

    public List<ReviewDto> GetByPropertyId(
        int propertyId
    )
    {
        return _context.Reviews
            .AsNoTracking()
            .Where(review =>
                review.PropertyId == propertyId
            )
            .OrderBy(review => review.Id)
            .Select(review =>
                new ReviewDto
                {
                    Id = review.Id,
                    PropertyId = review.PropertyId,
                    UserId = review.UserId,
                    UserName = review.UserName,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    CreatedAt = review.CreatedAt,
                    IsMock = review.IsMock
                }
            )
            .ToList();
    }

    public ReviewDto Create(
        ReviewDto review
    )
    {
        var entity =
            new ReviewEntity
            {
                PropertyId = review.PropertyId,
                UserId = review.UserId,
                UserName = review.UserName,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt =
                    DateTime.UtcNow.ToString("O"),
                IsMock = false
            };

        _context.Reviews.Add(entity);
        _context.SaveChanges();

        return ToDto(entity);
    }

    public bool Delete(
        int id,
        string userId
    )
    {
        var review =
            _context.Reviews
                .FirstOrDefault(
                    item => item.Id == id
                );

        if (review is null)
        {
            return false;
        }

        if (review.IsMock)
        {
            return false;
        }

        if (string.IsNullOrWhiteSpace(
                review.UserId
            ) ||
            review.UserId != userId)
        {
            return false;
        }

        _context.Reviews.Remove(review);
        _context.SaveChanges();

        return true;
    }

    public double GetAverageRating(
        int propertyId
    )
    {
        var average =
            _context.Reviews
                .AsNoTracking()
                .Where(review =>
                    review.PropertyId ==
                    propertyId
                )
                .Select(review =>
                    (double?)review.Rating
                )
                .Average();

        return average.HasValue
            ? Math.Round(average.Value, 1)
            : 0;
    }

    private static ReviewDto ToDto(
        ReviewEntity entity
    )
    {
        return new ReviewDto
        {
            Id = entity.Id,
            PropertyId = entity.PropertyId,
            UserId = entity.UserId,
            UserName = entity.UserName,
            Rating = entity.Rating,
            Comment = entity.Comment,
            CreatedAt = entity.CreatedAt,
            IsMock = entity.IsMock
        };
    }
}
