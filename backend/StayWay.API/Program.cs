using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StayWay.BusinessLayer;
using StayWay.BusinessLayer.Services;
using StayWay.DataAccessLayer.Context;
using StayWay.DataAccessLayer.Seeding;
using StayWay.Domain.Interfaces;
using StayWay.API.Services;


var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Entity Framework Core + SQLite
var connectionString =
    builder.Configuration.GetConnectionString(
        "DefaultConnection"
    )
    ?? throw new InvalidOperationException(
        "Connection string 'DefaultConnection' was not found."
    );

builder.Services.AddDbContext<AppDbContext>(
    options =>
        options.UseSqlite(connectionString)
);

// Services
builder.Services.AddScoped<
    IPropertyService,
    PropertyService
>();

builder.Services.AddScoped<
    IRoomService,
    RoomService
>();

builder.Services.AddScoped<
    IDestinationService,
    DestinationService
>();

builder.Services.AddScoped<
    IBookingService,
    BookingService
>();

builder.Services.AddScoped<
    IReviewService,
    ReviewService
>();

builder.Services.AddScoped<BusinessLogic>();

builder.Services.AddScoped<
    IUserService,
    UserService
>();

builder.Services.AddScoped<
    ITransferVehicleService,
    TransferVehicleService
>();

builder.Services.AddScoped<
    ITransferDriverService,
    TransferDriverService
>();

builder.Services.AddScoped<
    ITransferBookingService,
    TransferBookingService
>();

builder.Services.AddScoped<
    ISupportMessageService,
    SupportMessageService
>();

builder.Services.AddScoped<
    IJwtTokenService,
    JwtTokenService
>();

builder.Services.AddScoped<EmailService>();

// JWT
var jwtKey =
    builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "JWT key was not configured."
    );

var jwtIssuer =
    builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException(
        "JWT issuer was not configured."
    );

var jwtAudience =
    builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException(
        "JWT audience was not configured."
    );

builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme
    )
    .AddJwtBearer(
        options =>
        {
            options.TokenValidationParameters =
                new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,

                    IssuerSigningKey =
                        new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(
                                jwtKey
                            )
                        ),

                    ValidateIssuer = true,
                    ValidIssuer = jwtIssuer,

                    ValidateAudience = true,
                    ValidAudience = jwtAudience,

                    ValidateLifetime = true,

                    ClockSkew =
                        TimeSpan.FromMinutes(1),

                    NameClaimType =
                        ClaimTypes.NameIdentifier,

                    RoleClaimType =
                        ClaimTypes.Role
                };
        }
    );

builder.Services.AddAuthorization();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS for StayWay frontend
builder.Services.AddCors(
    options =>
    {
        options.AddPolicy(
            "StayWayFrontend",
            policy =>
            {
                policy
                    .WithOrigins(
                        "http://localhost:3000"
                    )
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            }
        );
    }
);

var app = builder.Build();

/*
 * Apply existing EF Core migrations
 * and seed the database when empty.
 */
using (var scope = app.Services.CreateScope())
{
    var dbContext =
        scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

    await dbContext.Database.MigrateAsync();

    var dataDirectory =
        Path.Combine(
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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();