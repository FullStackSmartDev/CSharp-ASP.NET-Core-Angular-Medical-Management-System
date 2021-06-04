using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class MedicationHistory_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MedicationHistory",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    MedicationId = table.Column<Guid>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    Dose = table.Column<int>(maxLength: 200, nullable: false),
                    Units = table.Column<string>(maxLength: 200, nullable: false),
                    DoseSchedule = table.Column<string>(maxLength: 200, nullable: false),
                    Route = table.Column<int>(nullable: false),
                    Prn = table.Column<bool>(nullable: true),
                    MedicationStatus = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicationHistory_Medication_MedicationId",
                        column: x => x.MedicationId,
                        principalTable: "Medication",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MedicationHistory_PatientDemographic_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientDemographic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicationHistory_MedicationId",
                table: "MedicationHistory",
                column: "MedicationId");

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
