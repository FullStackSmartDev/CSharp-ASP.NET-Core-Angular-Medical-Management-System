using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class VitalSigns_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VitalSigns",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    PatientId = table.Column<Guid>(nullable: false),
                    Pulse = table.Column<double>(nullable: true),
                    SystolicBloodPressure = table.Column<double>(nullable: true),
                    DiastolicBloodPressure = table.Column<double>(nullable: true),
                    BloodPressurePosition = table.Column<string>(maxLength: 100, nullable: true),
                    BloodPressureLocation = table.Column<string>(maxLength: 100, nullable: true),
                    DominantHand = table.Column<string>(maxLength: 100, nullable: true),
                    OxygenSaturationAtRest = table.Column<double>(nullable: true),
                    OxygenUse = table.Column<string>(maxLength: 100, nullable: true),
                    Weight = table.Column<double>(nullable: true),
                    LeftBicep = table.Column<double>(nullable: true),
                    RightBicep = table.Column<double>(nullable: true),
                    RightForearm = table.Column<double>(nullable: true),
                    RightThigh = table.Column<double>(nullable: true),
                    LeftThigh = table.Column<double>(nullable: true),
                    LeftForearm = table.Column<double>(nullable: true),
                    LeftCalf = table.Column<double>(nullable: true),
                    RightCalf = table.Column<double>(nullable: true),
                    Height = table.Column<double>(nullable: true),
                    OxygenAmount = table.Column<double>(nullable: true),
                    RespirationRate = table.Column<int>(nullable: true),
                    CreateDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VitalSigns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VitalSigns_PatientDemographic_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientDemographic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VitalSigns_PatientId",
                table: "VitalSigns",
                column: "PatientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VitalSigns");
        }
    }
}
