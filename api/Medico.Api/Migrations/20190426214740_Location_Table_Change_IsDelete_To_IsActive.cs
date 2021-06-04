using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Location_Table_Change_IsDelete_To_IsActive : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM Location WHERE IsDelete = 1");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "Location");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Location",
                nullable: false,
                defaultValue: true);

            migrationBuilder.Sql(@"UPDATE Location SET IsActive = 1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Location");

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "Location",
                nullable: false,
                defaultValue: false);

            migrationBuilder.Sql(@"UPDATE Location SET IsDelete = 0");
        }
    }
}
