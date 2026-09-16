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

builder.Services.AddSingleton<IPropertyService>(
    _ => new PropertyService(propertyDataPath)
);

builder.Services.AddSingleton<IRoomService>(
    _ => new RoomService(roomDataPath)
);

builder.Services.AddSingleton<IDestinationService>(
    _ => new DestinationService(destinationDataPath)
);

builder.Services.AddSingleton<BusinessLogic>();

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