using Microsoft.EntityFrameworkCore;
using StayWay.BusinessLayer;
using StayWay.BusinessLayer.Services;
using StayWay.DataAccessLayer.Context;
using StayWay.DataAccessLayer.Seeding;
using StayWay.Domain.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Entity Framework Core + SQLite
var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' was not found."
    );

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString)
);

// Temporary JSON persistence.
// These services will be migrated to AppDbContext next.
builder.Services.AddScoped<IPropertyService, PropertyService>();

builder.Services.AddScoped<IRoomService, RoomService>();

builder.Services.AddScoped<IDestinationService, DestinationService>();

builder.Services.AddScoped<IBookingService, BookingService>();

builder.Services.AddScoped<IReviewService, ReviewService>();

builder.Services.AddScoped<BusinessLogic>();

builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<ITransferVehicleService, TransferVehicleService>();

builder.Services.AddScoped<ITransferDriverService, TransferDriverService>();

builder.Services.AddScoped<ITransferBookingService, TransferBookingService>();

builder.Services.AddScoped<ISupportMessageService, SupportMessageService>();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS for StayWay frontend
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

/*
 * Apply existing EF Core migrations
 * and import the old JSON data once
 * when the database is empty.
 */
using (var scope = app.Services.CreateScope())
{
    var dbContext =
        scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

    await dbContext.Database.MigrateAsync();

    var dataDirectory = Path.Combine(
        app.Environment.ContentRootPath,
        "Data"
    );

    await DatabaseSeeder.SeedAsync(
        dbContext,
        dataDirectory
    );
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("StayWayFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();
