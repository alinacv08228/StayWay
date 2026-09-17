using StayWay.Domain.DTOs;

namespace StayWay.Domain.Interfaces;

public interface IReviewService
{
    List<ReviewDto> GetAll();

    ReviewDto? GetById(int id);

    List<ReviewDto> GetByPropertyId(int propertyId);

    ReviewDto Create(ReviewDto review);

    bool Delete(
        int id,
        string userId
    );

    double GetAverageRating(
        int propertyId
    );
}