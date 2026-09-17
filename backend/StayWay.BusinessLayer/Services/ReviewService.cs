using System.Text.Json;
using StayWay.Domain.DTOs;
using StayWay.Domain.Entities;
using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer.Services;

public class ReviewService : IReviewService
{
    private readonly string _dataPath;

    private readonly JsonSerializerOptions _jsonOptions =
        new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

    public ReviewService(string dataPath)
    {
        _dataPath = dataPath;
        EnsureDataFileExists();
    }

    public List<ReviewDto> GetAll()
    {
        return LoadReviews()
            .Select(ToDto)
            .ToList();
    }

    public ReviewDto? GetById(int id)
    {
        var review = LoadReviews()
            .FirstOrDefault(item => item.Id == id);

        return review is null
            ? null
            : ToDto(review);
    }

    public List<ReviewDto> GetByPropertyId(int propertyId)
    {
        return LoadReviews()
            .Where(item => item.PropertyId == propertyId)
            .Select(ToDto)
            .ToList();
    }

    public ReviewDto Create(ReviewDto review)
    {
        var reviews = LoadReviews();

        var newReview = new ReviewEntity
        {
            Id = reviews.Count == 0
                ? 1
                : reviews.Max(item => item.Id) + 1,
            PropertyId = review.PropertyId,
            UserId = review.UserId,
            UserName = review.UserName,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = DateTime.UtcNow.ToString("O"),
            IsMock = false
        };

        reviews.Add(newReview);
        SaveReviews(reviews);

        return ToDto(newReview);
    }

    public bool Delete(
        int id,
        string userId
    )
    {
        var reviews = LoadReviews();

        var review = reviews
            .FirstOrDefault(item => item.Id == id);

        if (review is null)
        {
            return false;
        }

        if (review.IsMock)
        {
            return false;
        }

        if (
            string.IsNullOrWhiteSpace(
                review.UserId
            ) ||
            review.UserId != userId
        )
        {
            return false;
        }

        reviews.Remove(review);
        SaveReviews(reviews);

        return true;
    }

    public double GetAverageRating(
        int propertyId
    )
    {
        var propertyReviews = LoadReviews()
            .Where(
                item =>
                    item.PropertyId ==
                    propertyId
            )
            .ToList();

        if (propertyReviews.Count == 0)
        {
            return 0;
        }

        return Math.Round(
            propertyReviews.Average(
                item => item.Rating
            ),
            1
        );
    }

    private List<ReviewEntity> LoadReviews()
    {
        EnsureDataFileExists();

        var json =
            File.ReadAllText(
                _dataPath
            );

        if (
            string.IsNullOrWhiteSpace(
                json
            )
        )
        {
            return new List<ReviewEntity>();
        }

        return JsonSerializer.Deserialize<
                   List<ReviewEntity>
               >(
                   json,
                   _jsonOptions
               )
               ??
               new List<ReviewEntity>();
    }

    private void SaveReviews(
        List<ReviewEntity> reviews
    )
    {
        var json =
            JsonSerializer.Serialize(
                reviews,
                _jsonOptions
            );

        File.WriteAllText(
            _dataPath,
            json
        );
    }

    private void EnsureDataFileExists()
    {
        var directory =
            Path.GetDirectoryName(
                _dataPath
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

        if (!File.Exists(_dataPath))
        {
            File.WriteAllText(
                _dataPath,
                "[]"
            );
        }
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
