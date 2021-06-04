using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class VitalSigns_BaseVitalSigns_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BaseVitalSignsId",
                table: "Patient",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "BaseVitalSigns",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    PatientId = table.Column<Guid>(nullable: false),
                    DominantHand = table.Column<string>(maxLength: 100, nullable: true),
                    Weight = table.Column<double>(nullable: true),
                    Height = table.Column<double>(nullable: true),
                    LeftBicep = table.Column<double>(nullable: true),
                    RightBicep = table.Column<double>(nullable: true),
                    LeftForearm = table.Column<double>(nullable: true),
                    RightForearm = table.Column<double>(nullable: true),
                    LeftThigh = table.Column<double>(nullable: true),
                    RightThigh = table.Column<double>(nullable: true),
                    LeftCalf = table.Column<double>(nullable: true),
                    RightCalf = table.Column<double>(nullable: true),
                    OxygenUse = table.Column<string>(maxLength: 100, nullable: true),
                    OxygenAmount = table.Column<double>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaseVitalSigns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BaseVitalSigns_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VitalSigns",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    AdmissionId = table.Column<Guid>(nullable: true),
                    PatientId = table.Column<Guid>(nullable: false),
                    Pulse = table.Column<double>(nullable: true),
                    SystolicBloodPressure = table.Column<double>(nullable: true),
                    DiastolicBloodPressure = table.Column<double>(nullable: true),
                    BloodPressurePosition = table.Column<string>(maxLength: 100, nullable: true),
                    BloodPressureLocation = table.Column<string>(maxLength: 100, nullable: true),
                    OxygenSaturationAtRest = table.Column<string>(maxLength: 100, nullable: true),
                    OxygenSaturationAtRestValue = table.Column<double>(nullable: true),
                    RespirationRate = table.Column<int>(nullable: true),
                    CreateDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VitalSigns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VitalSigns_Admission_AdmissionId",
                        column: x => x.AdmissionId,
                        principalTable: "Admission",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VitalSigns_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BaseVitalSigns_PatientId",
                table: "BaseVitalSigns",
                column: "PatientId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VitalSigns_AdmissionId",
                table: "VitalSigns",
                column: "AdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_VitalSigns_PatientId",
                table: "VitalSigns",
                column: "PatientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BaseVitalSigns");

            migrationBuilder.DropTable(
                name: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "BaseVitalSignsId",
                table: "Patient");
        }
    }
}
