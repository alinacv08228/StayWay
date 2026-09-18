using StayWay.Domain.Interfaces;

namespace StayWay.BusinessLayer;

public class BusinessLogic
{
    public IPropertyService Properties { get; }
    public IRoomService Rooms { get; }
    public IDestinationService Destinations { get; }
    public IBookingService Bookings { get; }
    public IReviewService Reviews { get; }
    public IUserService Users { get; }
    public ITransferVehicleService TransferVehicles { get; }
    public ITransferDriverService TransferDrivers { get; }
    public ITransferBookingService TransferBookings { get; }
    public ISupportMessageService SupportMessages { get; }

    public BusinessLogic(
        IPropertyService propertyService,
        IRoomService roomService,
        IDestinationService destinationService,
        IBookingService bookingService,
        IReviewService reviewService,
        IUserService userService,
        ITransferVehicleService transferVehicleService,
        ITransferDriverService transferDriverService,
        ITransferBookingService transferBookingService,
        ISupportMessageService supportMessageService
    )
    {
        Properties = propertyService;
        Rooms = roomService;
        Destinations = destinationService;
        Bookings = bookingService;
        Reviews = reviewService;
        Users = userService;
        TransferVehicles = transferVehicleService;
        TransferDrivers = transferDriverService;
        TransferBookings = transferBookingService;
        SupportMessages = supportMessageService;
    }
}