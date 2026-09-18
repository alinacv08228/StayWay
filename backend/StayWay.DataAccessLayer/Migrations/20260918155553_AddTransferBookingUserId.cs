using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StayWay.DataAccessLayer.Migrations
{
    public partial class AddTransferBookingUserId : Migration
    {
        protected override void Up(
            MigrationBuilder migrationBuilder
        )
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "TransferBookings",
                type: "TEXT",
                nullable: true
            );

            /*
             * Existing transfer bookings were created before
             * UserId existed.
             *
             * Link them to an existing StayWay account when
             * the booking email matches the user's email.
             */
            migrationBuilder.Sql(
                """
                UPDATE TransferBookings
                SET UserId = (
                    SELECT Users.Id
                    FROM Users
                    WHERE LOWER(Users.Email) =
                          LOWER(TransferBookings.Email)
                    LIMIT 1
                )
                WHERE EXISTS (
                    SELECT 1
                    FROM Users
                    WHERE LOWER(Users.Email) =
                          LOWER(TransferBookings.Email)
                );
                """
            );
        }

        protected override void Down(
            MigrationBuilder migrationBuilder
        )
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TransferBookings"
            );
        }
    }
}