using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Room_Table_Change_IsDelete_To_IsActive : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM Room WHERE IsDelete = 1");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "Room");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Room",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Room",
                nullable: false,
                defaultValueSql: "newsequentialid()",
                oldClrType: typeof(Guid));

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Room",
                nullable: false,
                defaultValue: true);

            migrationBuilder.Sql(@"UPDATE Room SET IsActive = 1");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Room");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Room",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Room",
                nullable: false,
                oldClrType: typeof(Guid),
                oldDefaultValueSql: "newsequentialid()");

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "Room",
                nullable: true);

            migrationBuilder.Sql(@"UPDATE Room SET IsDelete = 0");
        }
    }
}
