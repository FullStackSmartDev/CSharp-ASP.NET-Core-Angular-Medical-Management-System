using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_SignatureInfo_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSignedOff",
                table: "Admission");

            migrationBuilder.AddColumn<Guid>(
                name: "SignatureInfoId",
                table: "Admission",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SignatureInfo",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    EmployeeId = table.Column<Guid>(nullable: false),
                    AdmissionId = table.Column<Guid>(nullable: false),
                    SignDate = table.Column<DateTime>(nullable: false),
                    IsUnsigned = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SignatureInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SignatureInfo_Admission_AdmissionId",
                        column: x => x.AdmissionId,
                        principalTable: "Admission",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SignatureInfo_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SignatureInfo_AdmissionId",
                table: "SignatureInfo",
                column: "AdmissionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SignatureInfo_EmployeeId",
                table: "SignatureInfo",
                column: "EmployeeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SignatureInfo");

            migrationBuilder.DropColumn(
                name: "SignatureInfoId",
                table: "Admission");

            migrationBuilder.AddColumn<bool>(
                name: "IsSignedOff",
                table: "Admission",
                nullable: false,
                defaultValue: false);
        }
    }
}
