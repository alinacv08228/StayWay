using Microsoft.AspNetCore.Mvc;
using StayWay.Domain.DTOs;
using StayWay.Domain.Interfaces;

namespace StayWay.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    public ActionResult<List<ReviewDto>> GetAll()
    {
        return Ok(_reviewService.GetAll());
    }

    [HttpGet("{id:int}")]
    public ActionResult<ReviewDto> GetById(int id)
    {
        var review = _reviewService.GetById(id);

        if (review is null)
        {
            return NotFound();
        }

        return Ok(review);
    }

    [HttpGet("property/{propertyId:int}")]
    public ActionResult<List<ReviewDto>> GetByPropertyId(int propertyId)
    {
        return Ok(
            _reviewService.GetByPropertyId(
                propertyId
            )
        );
    }

    [HttpGet("property/{propertyId:int}/average")]
    public ActionResult<double> GetAverageRating(int propertyId)
    {
        return Ok(
            _reviewService.GetAverageRating(
                propertyId
            )
        );
    }

    [HttpPost]
    public ActionResult<ReviewDto> Create(ReviewDto review)
    {
        if (review.PropertyId <= 0)
        {
            return BadRequest(
                new
                {
                    message = "A valid propertyId is required."
                }
            );
        }

        if (string.IsNullOrWhiteSpace(review.UserId))
        {
            return BadRequest(
                new
                {
                    message = "A valid userId is required."
                }
            );
        }

        if (string.IsNullOrWhiteSpace(review.UserName))
        {
            return BadRequest(
                new
                {
                    message = "User name is required."
                }
            );
        }

        if (review.Rating < 1 || review.Rating > 5)
        {
            return BadRequest(
                new
                {
                    message = "Rating must be between 1 and 5."
                }
            );
        }

        if (
            string.IsNullOrWhiteSpace(
                review.Comment
            ) ||
            review.Comment.Trim().Length < 10
        )
        {
            return BadRequest(
                new
                {
                    message = "Review comment must contain at least 10 characters."
                }
            );
        }

        var createdReview =
            _reviewService.Create(review);

        return CreatedAtAction(
            nameof(GetById),
            new
            {
                id = createdReview.Id
            },
            createdReview
        );
    }

    [HttpDelete("{id:int}")]
    public IActionResult Delete(
        int id,
        [FromQuery] string userId
    )
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return BadRequest(
                new
                {
                    message = "userId is required."
                }
            );
        }

        var review =
            _reviewService.GetById(id);

        if (review is null)
        {
            return NotFound();
        }

        if (review.IsMock)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new
                {
                    message = "Mock reviews cannot be deleted."
                }
            );
        }

        if (review.UserId != userId)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                new
                {
                    message = "You can delete only your own review."
                }
            );
        }

        var deleted =
            _reviewService.Delete(
                id,
                userId
            );

        if (!deleted)
        {
            return BadRequest();
        }

        return NoContent();
    }
}
