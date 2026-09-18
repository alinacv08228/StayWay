using StayWay.BusinessLayer;
using StayWay.BusinessLayer.Services;
using StayWay.Domain.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

var propertyDataPath = Path.Combine(
    builder.Environment.ContentRootPath,
    "Data",
    "properties.json"
);

var roomDataPath = Path.Combine(
    builder.Environment.ContentRootPath,
    "Data",
    "rooms.json"
);

var destinationDataPath = Path.Combine(
    builder.Environment.ContentRootPath,
    "Data",
    "destinations.json"
);

var bookingDataPath = Path.Combine(
    builder.Environment.ContentRootPath,
    "Data",
    "bookings.json"
);

var reviewDataPath = Path.Combine(
    builder.Environment.ContentRootPath,
    "Data",
    "reviews.json"
);

var userDataPath = Path.Combine(
    builder.Environment.ContentRootPath,
    "Data",
    "users.json"
);

var transferVehicleDataPath = Path.Combine(
    builder.Environment.ContentRootPath,
    "Data",
    "transferVehicles.json"
);

var transferDriverDataPath = Path.Combine(
    builder.Environment.ContentRootPath,
    "Data",
    "transferDrivers.json"
);

var transferBookingDataPath = Path.Combine(
    builder.Environment.ContentRootPath,
    "Data",
    "transferBookings.json"
);

var supportMessageDataPath = Path.Combine(
    builder.Environment.ContentRootPath,
    "Data",
    "supportMessages.json"
);

builder.Services.AddSingleton<IPropertyService>(
    _ => new PropertyService(propertyDataPath)
);

builder.Services.AddSingleton<IRoomService>(
    _ => new RoomService(roomDataPath)
);

builder.Services.AddSingleton<IDestinationService>(
    _ => new DestinationService(destinationDataPath)
);

builder.Services.AddSingleton<IBookingService>(
    _ => new BookingService(bookingDataPath)
);

builder.Services.AddSingleton<IReviewService>(
    _ => new ReviewService(reviewDataPath)
);

builder.Services.AddSingleton<BusinessLogic>();

builder.Services.AddSingleton<IUserService>(
    _ => new UserService(userDataPath)
);

builder.Services.AddSingleton<ITransferVehicleService>(
    _ => new TransferVehicleService(
        transferVehicleDataPath
    )
);

builder.Services.AddSingleton<ITransferDriverService>(
    _ => new TransferDriverService(
        transferDriverDataPath
    )
);

builder.Services.AddSingleton<ITransferBookingService>(
    _ => new TransferBookingService(
        transferBookingDataPath
    )
);

builder.Services.AddSingleton<ISupportMessageService>(
    _ => new SupportMessageService(
        supportMessageDataPath
    )
);

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS pentru frontend-ul StayWay
builder.Services.AddCors(options =>
{
    options.AddPolicy("StayWayFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("StayWayFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();