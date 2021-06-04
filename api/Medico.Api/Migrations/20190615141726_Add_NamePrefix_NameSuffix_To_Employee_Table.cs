using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_NamePrefix_NameSuffix_To_Employee_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NamePrefix",
                table: "Employee",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameSuffix",
                table: "Employee",
                maxLength: 100,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NamePrefix",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "NameSuffix",
                table: "Employee");
        }
    }
}
