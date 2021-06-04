using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class MedicationHistory_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MedicationHistory",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    CreateDate = table.Column<DateTime>(nullable: false),
                    Medication = table.Column<string>(maxLength: 2000, nullable: true),
                    PatientId = table.Column<Guid>(nullable: false),
                    Dose = table.Column<int>(maxLength: 100, nullable: true),
                    Units = table.Column<string>(maxLength: 100, nullable: true),
                    DoseSchedule = table.Column<string>(maxLength: 100, nullable: true),
                    Route = table.Column<string>(maxLength: 100, nullable: true),
                    Prn = table.Column<bool>(nullable: true),
                    MedicationStatus = table.Column<string>(maxLength: 100, nullable: true),
                    Notes = table.Column<string>(maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicationHistory_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicationHistory_PatientId",
                table: "MedicationHistory",
                column: "PatientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicationHistory");
        }
    }
}
