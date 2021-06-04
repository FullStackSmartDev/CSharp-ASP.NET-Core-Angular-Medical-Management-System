using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Employee_Table_Change_IsDelete_To_IsActive : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUser_Employee_EmployeeId",
                table: "AppUser");

            migrationBuilder.DropIndex(
                name: "IX_AppUser_EmployeeId",
                table: "AppUser");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "Employee");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Employee",
                nullable: false,
                defaultValue: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employee_AppUserId",
                table: "Employee",
                column: "AppUserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Employee_AppUser_AppUserId",
                table: "Employee",
                column: "AppUserId",
                principalTable: "AppUser",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.Sql(@"UPDATE Employee SET IsActive = 1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employee_AppUser_AppUserId",
                table: "Employee");

            migrationBuilder.DropIndex(
                name: "IX_Employee_AppUserId",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Employee");

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "Employee",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_AppUser_EmployeeId",
                table: "AppUser",
                column: "EmployeeId",
                unique: true,
                filter: "[EmployeeId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUser_Employee_EmployeeId",
                table: "AppUser",
                column: "EmployeeId",
                principalTable: "Employee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.Sql(@"UPDATE Employee SET IsDelete = 0");
        }
    }
}
