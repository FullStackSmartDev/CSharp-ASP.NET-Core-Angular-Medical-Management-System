using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_AppUser_To_Employee_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AppUserId",
                table: "Employee",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "EmployeeId",
                table: "AppUser",
                nullable: true);

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
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppUser_Employee_EmployeeId",
                table: "AppUser");

            migrationBuilder.DropIndex(
                name: "IX_AppUser_EmployeeId",
                table: "AppUser");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Employee");

            migrationBuilder.DropColumn(
                name: "EmployeeId",
                table: "AppUser");
        }
    }
}
