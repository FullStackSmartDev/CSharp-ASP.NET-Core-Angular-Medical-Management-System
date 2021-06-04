using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Allergy_Medication_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OccupationalHistory_Patient_PatientId",
                table: "OccupationalHistory");

            migrationBuilder.CreateTable(
                name: "Allergy",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    Reaction = table.Column<string>(maxLength: 100, nullable: false),
                    Medication = table.Column<string>(maxLength: 2000, nullable: false),
                    Notes = table.Column<string>(maxLength: 2000, nullable: true),
                    PatientId = table.Column<Guid>(nullable: false),
                    CreateDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Allergy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Allergy_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Medication",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    NdcCode = table.Column<string>(maxLength: 2000, nullable: true),
                    PackageDescription = table.Column<string>(maxLength: 4000, nullable: true),
                    ElevenDigitNdcCode = table.Column<string>(maxLength: 2000, nullable: true),
                    NonProprietaryName = table.Column<string>(maxLength: 2000, nullable: true),
                    DosageFormName = table.Column<string>(maxLength: 2000, nullable: true),
                    RouteName = table.Column<string>(maxLength: 2000, nullable: true),
                    SubstanceName = table.Column<string>(maxLength: 4000, nullable: true),
                    StrengthNumber = table.Column<string>(maxLength: 2000, nullable: true),
                    StrengthUnit = table.Column<string>(maxLength: 4000, nullable: true),
                    PharmaceuticalClasses = table.Column<string>(maxLength: 4000, nullable: true),
                    DeaSchedule = table.Column<string>(maxLength: 2000, nullable: true),
                    Status = table.Column<string>(maxLength: 2000, nullable: true),
                    LastUpdate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medication", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Allergy_PatientId",
                table: "Allergy",
                column: "PatientId");

            migrationBuilder.AddForeignKey(
                name: "FK_OccupationalHistory_Patient_PatientId",
                table: "OccupationalHistory",
                column: "PatientId",
                principalTable: "Patient",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OccupationalHistory_Patient_PatientId",
                table: "OccupationalHistory");

            migrationBuilder.DropTable(
                name: "Allergy");

            migrationBuilder.DropTable(
                name: "Medication");

            migrationBuilder.AddForeignKey(
                name: "FK_OccupationalHistory_Patient_PatientId",
                table: "OccupationalHistory",
                column: "PatientId",
                principalTable: "Patient",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
