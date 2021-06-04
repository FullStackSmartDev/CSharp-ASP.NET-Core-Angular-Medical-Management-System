using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_ZipCodeType_To_Company_Location_MedicoApplicationUser_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ZipCodeType",
                table: "MedicoApplicationUser",
                nullable: false,
                defaultValue: 2);

            migrationBuilder.AddColumn<int>(
                name: "ZipCodeType",
                table: "Location",
                nullable: false,
                defaultValue: 2);

            migrationBuilder.AddColumn<int>(
                name: "ZipCodeType",
                table: "Company",
                nullable: false,
                defaultValue: 2);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ZipCodeType",
                table: "MedicoApplicationUser");

            migrationBuilder.DropColumn(
                name: "ZipCodeType",
                table: "Location");

            migrationBuilder.DropColumn(
                name: "ZipCodeType",
                table: "Company");
        }
    }
}
