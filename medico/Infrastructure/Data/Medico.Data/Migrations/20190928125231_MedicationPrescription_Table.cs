using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class MedicationPrescription_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MedicationPrescription",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    PatientId = table.Column<Guid>(nullable: false),
                    AdmissionId = table.Column<Guid>(nullable: false),
                    MedicationNameId = table.Column<Guid>(nullable: true),
                    Medication = table.Column<string>(maxLength: 4000, nullable: false),
                    Dose = table.Column<string>(maxLength: 100, nullable: false),
                    DosageForm = table.Column<string>(maxLength: 100, nullable: true),
                    Route = table.Column<string>(maxLength: 2000, nullable: false),
                    Units = table.Column<string>(maxLength: 100, nullable: false),
                    Dispense = table.Column<int>(nullable: false),
                    Refills = table.Column<int>(nullable: false),
                    Sig = table.Column<string>(maxLength: 4000, nullable: false),
                    StartDate = table.Column<DateTime>(nullable: false),
                    EndDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicationPrescription", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicationPrescription_Admission_AdmissionId",
                        column: x => x.AdmissionId,
                        principalTable: "Admission",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicationPrescription_MedicationName_MedicationNameId",
                        column: x => x.MedicationNameId,
                        principalTable: "MedicationName",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicationPrescription_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicationPrescription_AdmissionId",
                table: "MedicationPrescription",
                column: "AdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationPrescription_MedicationNameId",
                table: "MedicationPrescription",
                column: "MedicationNameId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicationPrescription_PatientId",
                table: "MedicationPrescription",
                column: "PatientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicationPrescription");
        }
    }
}
