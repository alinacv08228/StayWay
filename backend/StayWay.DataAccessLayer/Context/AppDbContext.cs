using Microsoft.EntityFrameworkCore;
using StayWay.Domain.Entities;

namespace StayWay.DataAccessLayer.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(
        DbContextOptions<AppDbContext> options
    ) : base(options)
    {
    }

    public DbSet<UserEntity> Users =>
        Set<UserEntity>();

    public DbSet<DestinationEntity> Destinations =>
        Set<DestinationEntity>();

    public DbSet<PropertyEntity> Properties =>
        Set<PropertyEntity>();

    public DbSet<RoomEntity> Rooms =>
        Set<RoomEntity>();

    public DbSet<BookingEntity> Bookings =>
        Set<BookingEntity>();

    public DbSet<ReviewEntity> Reviews =>
        Set<ReviewEntity>();

    public DbSet<AirportEntity> Airports =>
        Set<AirportEntity>();

    public DbSet<TransferVehicleEntity> TransferVehicles =>
        Set<TransferVehicleEntity>();

    public DbSet<TransferDriverEntity> TransferDrivers =>
        Set<TransferDriverEntity>();

    public DbSet<TransferBookingEntity> TransferBookings =>
        Set<TransferBookingEntity>();

    public DbSet<SupportMessageEntity> SupportMessages =>
        Set<SupportMessageEntity>();

    protected override void OnModelCreating(
        ModelBuilder modelBuilder
    )
    {
        base.OnModelCreating(modelBuilder);

        /*
         * =========================================
         * USERS
         * =========================================
         */

        modelBuilder.Entity<UserEntity>()
            .HasKey(user => user.Id);

        modelBuilder.Entity<UserEntity>()
            .Property(user => user.Id)
            .ValueGeneratedNever();

        modelBuilder.Entity<UserEntity>()
            .HasIndex(user => user.Email)
            .IsUnique();


        /*
         * =========================================
         * DESTINATIONS
         * =========================================
         */

        modelBuilder.Entity<DestinationEntity>()
            .HasKey(destination => destination.Id);


        /*
         * =========================================
         * PROPERTIES
         * =========================================
         */

        modelBuilder.Entity<PropertyEntity>()
            .HasKey(property => property.Id);

        modelBuilder.Entity<PropertyEntity>()
            .HasOne<DestinationEntity>()
            .WithMany()
            .HasForeignKey(property =>
                property.DestinationId
            )
            .OnDelete(DeleteBehavior.Restrict);


        /*
         * =========================================
         * ROOMS
         * =========================================
         */

        modelBuilder.Entity<RoomEntity>()
            .HasKey(room => room.Id);

        modelBuilder.Entity<RoomEntity>()
            .HasOne<PropertyEntity>()
            .WithMany()
            .HasForeignKey(room =>
                room.PropertyId
            )
            .OnDelete(DeleteBehavior.Cascade);


        /*
         * =========================================
         * BOOKINGS
         * =========================================
         */

        modelBuilder.Entity<BookingEntity>()
            .HasKey(booking => booking.Id);

        modelBuilder.Entity<BookingEntity>()
            .HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(booking =>
                booking.UserId
            )
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<BookingEntity>()
            .HasOne<PropertyEntity>()
            .WithMany()
            .HasForeignKey(booking =>
                booking.PropertyId
            )
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<BookingEntity>()
            .HasOne<RoomEntity>()
            .WithMany()
            .HasForeignKey(booking =>
                booking.RoomId
            )
            .OnDelete(DeleteBehavior.SetNull);


        /*
         * =========================================
         * REVIEWS
         * =========================================
         */

        modelBuilder.Entity<ReviewEntity>()
            .HasKey(review => review.Id);

        modelBuilder.Entity<ReviewEntity>()
            .HasOne<PropertyEntity>()
            .WithMany()
            .HasForeignKey(review =>
                review.PropertyId
            )
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ReviewEntity>()
            .HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(review =>
                review.UserId
            )
            .OnDelete(DeleteBehavior.SetNull);

        /*
         * =========================================
         * AIRPORTS
         * =========================================
         */

        modelBuilder.Entity<AirportEntity>()
            .HasKey(airport => airport.Id);

        modelBuilder.Entity<AirportEntity>()
            .Property(airport => airport.Id)
            .ValueGeneratedNever();

        modelBuilder.Entity<AirportEntity>()
            .HasIndex(airport => airport.City);

        /*
         * =========================================
         * TRANSFER DRIVERS
         * =========================================
         */

        modelBuilder.Entity<TransferDriverEntity>()
            .HasKey(driver => driver.Id);

        modelBuilder.Entity<TransferDriverEntity>()
            .Property(driver => driver.Id)
            .ValueGeneratedNever();


        /*
         * =========================================
         * TRANSFER VEHICLES
         * =========================================
         */

        modelBuilder.Entity<TransferVehicleEntity>()
            .HasKey(vehicle => vehicle.Id);

        modelBuilder.Entity<TransferVehicleEntity>()
            .Property(vehicle => vehicle.Id)
            .ValueGeneratedNever();

        modelBuilder.Entity<TransferVehicleEntity>()
            .HasIndex(vehicle =>
                vehicle.LicensePlate
            )
            .IsUnique();

        modelBuilder.Entity<TransferVehicleEntity>()
            .HasOne<TransferDriverEntity>()
            .WithMany()
            .HasForeignKey(vehicle =>
                vehicle.DriverId
            )
            .OnDelete(DeleteBehavior.SetNull);


        /*
         * =========================================
         * TRANSFER BOOKINGS
         * =========================================
         */

        modelBuilder.Entity<TransferBookingEntity>()
            .HasKey(booking => booking.Id);

        modelBuilder.Entity<TransferBookingEntity>()
            .Property(booking => booking.Id)
            .ValueGeneratedNever();

        modelBuilder.Entity<TransferBookingEntity>()
            .HasOne<TransferVehicleEntity>()
            .WithMany()
            .HasForeignKey(booking =>
                booking.VehicleId
            )
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<TransferBookingEntity>()
            .HasOne<TransferDriverEntity>()
            .WithMany()
            .HasForeignKey(booking =>
                booking.DriverId
            )
            .OnDelete(DeleteBehavior.SetNull);


        /*
         * =========================================
         * SUPPORT MESSAGES
         * =========================================
         */

        modelBuilder.Entity<SupportMessageEntity>()
            .HasKey(message => message.Id);

        modelBuilder.Entity<SupportMessageEntity>()
            .HasOne<UserEntity>()
            .WithMany()
            .HasForeignKey(message =>
                message.UserId
            )
            .OnDelete(DeleteBehavior.Restrict);
    }
}
