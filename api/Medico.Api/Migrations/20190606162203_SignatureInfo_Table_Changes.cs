using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class SignatureInfo_Table_Changes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SignatureInfo_Employee_EmployeeId",
                table: "SignatureInfo");

            migrationBuilder.AlterColumn<bool>(
                name: "IsUnsigned",
                table: "SignatureInfo",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool));

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "SignatureInfo",
                nullable: false,
                defaultValueSql: "newsequentialid()",
                oldClrType: typeof(Guid));

            migrationBuilder.AddForeignKey(
                name: "FK_SignatureInfo_Employee_EmployeeId",
                table: "SignatureInfo",
                column: "EmployeeId",
                principalTable: "Employee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SignatureInfo_Employee_EmployeeId",
                table: "SignatureInfo");

            migrationBuilder.AlterColumn<bool>(
                name: "IsUnsigned",
                table: "SignatureInfo",
                nullable: false,
                oldClrType: typeof(bool),
                oldDefaultValue: false);

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "SignatureInfo",
                nullable: false,
                oldClrType: typeof(Guid),
                oldDefaultValueSql: "newsequentialid()");

            migrationBuilder.AddForeignKey(
                name: "FK_SignatureInfo_Employee_EmployeeId",
                table: "SignatureInfo",
                column: "EmployeeId",
                principalTable: "Employee",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
