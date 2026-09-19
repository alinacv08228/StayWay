using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using StayWay.DataAccessLayer.Context;
using StayWay.Domain.Entities;

namespace StayWay.DataAccessLayer.Seeding;

public static class DatabaseSeeder
{
    private static readonly JsonSerializerOptions JsonOptions =
        new()
        {
            PropertyNameCaseInsensitive = true
        };

    public static async Task SeedAsync(
        AppDbContext context,
        string dataDirectory
    )
    {
        if (!Directory.Exists(dataDirectory))
        {
            throw new DirectoryNotFoundException(
                $"Seed data directory was not found: {dataDirectory}"
            );
        }

/*
 * Check whether the main StayWay data already exists.
 * Airports are reference data and are seeded separately,
 * so they can also be added to an existing database.
 */
        var databaseHasData =
            await context.Users.AnyAsync() ||
            await context.Destinations.AnyAsync() ||
            await context.Properties.AnyAsync() ||
            await context.Rooms.AnyAsync() ||
            await context.Bookings.AnyAsync() ||
            await context.Reviews.AnyAsync() ||
            await context.TransferDrivers.AnyAsync() ||
            await context.TransferVehicles.AnyAsync() ||
            await context.TransferBookings.AnyAsync() ||
            await context.SupportMessages.AnyAsync();

        var airports =
            await LoadAsync<AirportEntity>(
                Path.Combine(
                    dataDirectory,
                    "airports.json"
                )
            );

        if (!await context.Airports.AnyAsync())
        {
            await context.Airports.AddRangeAsync(
                airports
            );

            await context.SaveChangesAsync();
        }

        if (databaseHasData)
        {
            return;
        }

        /*
         * Load the existing StayWay JSON data.
         */
        var users =
            await LoadAsync<UserEntity>(
                Path.Combine(dataDirectory, "users.json")
            );

        var destinations =
            await LoadAsync<DestinationEntity>(
                Path.Combine(dataDirectory, "destinations.json")
            );

        var properties =
            await LoadAsync<PropertyEntity>(
                Path.Combine(dataDirectory, "properties.json")
            );

        var rooms =
            await LoadAsync<RoomEntity>(
                Path.Combine(dataDirectory, "rooms.json")
            );

        var bookings =
            await LoadAsync<BookingEntity>(
                Path.Combine(dataDirectory, "bookings.json")
            );

        var reviews =
            await LoadAsync<ReviewEntity>(
                Path.Combine(dataDirectory, "reviews.json")
            );

        var transferDrivers =
            await LoadAsync<TransferDriverEntity>(
                Path.Combine(dataDirectory, "transferDrivers.json")
            );

        var transferVehicles =
            await LoadAsync<TransferVehicleEntity>(
                Path.Combine(dataDirectory, "transferVehicles.json")
            );

        var transferBookings =
            await LoadAsync<TransferBookingEntity>(
                Path.Combine(dataDirectory, "transferBookings.json")
            );

        var supportMessages =
            await LoadAsync<SupportMessageEntity>(
                Path.Combine(dataDirectory, "supportMessages.json")
            );

        /*
         * Use one transaction so that a failed import
         * cannot leave the database partially populated.
         */
        await using var transaction =
            await context.Database.BeginTransactionAsync();

        try
        {
            /*
             * Parent tables first.
             */
            await context.Users.AddRangeAsync(users);

            await context.Destinations.AddRangeAsync(
                destinations
            );

            await context.TransferDrivers.AddRangeAsync(
                transferDrivers
            );

            /*
             * Tables that depend on the parents.
             */
            await context.Properties.AddRangeAsync(
                properties
            );

            await context.TransferVehicles.AddRangeAsync(
                transferVehicles
            );

            await context.Rooms.AddRangeAsync(
                rooms
            );

            /*
             * Child / transactional data.
             */
            await context.Reviews.AddRangeAsync(
                reviews
            );

            await context.SupportMessages.AddRangeAsync(
                supportMessages
            );

            await context.TransferBookings.AddRangeAsync(
                transferBookings
            );

            await context.Bookings.AddRangeAsync(
                bookings
            );

            await context.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private static async Task<List<T>> LoadAsync<T>(
        string path
    )
    {
        if (!File.Exists(path))
        {
            throw new FileNotFoundException(
                $"Seed file was not found: {path}"
            );
        }

        await using var stream =
            File.OpenRead(path);

        return
            await JsonSerializer.DeserializeAsync<List<T>>(
                stream,
                JsonOptions
            ) ?? [];
    }
}
