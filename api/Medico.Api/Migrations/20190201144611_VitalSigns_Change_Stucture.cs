using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class VitalSigns_Change_Stucture : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DominantHand",
                table: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "Height",
                table: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "LeftBicep",
                table: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "LeftCalf",
                table: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "LeftForearm",
                table: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "LeftThigh",
                table: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "OxygenAmount",
                table: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "OxygenUse",
                table: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "RightBicep",
                table: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "RightCalf",
                table: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "RightForearm",
                table: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "RightThigh",
                table: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "Weight",
                table: "VitalSigns");

            migrationBuilder.AlterColumn<string>(
                name: "OxygenSaturationAtRest",
                table: "VitalSigns",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(double),
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AdmissionId",
                table: "VitalSigns",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "BaseVitalSigns",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
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
                        name: "FK_BaseVitalSigns_PatientDemographic_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientDemographic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VitalSigns_AdmissionId",
                table: "VitalSigns",
                column: "AdmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_BaseVitalSigns_PatientId",
                table: "BaseVitalSigns",
                column: "PatientId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_VitalSigns_Admission_AdmissionId",
                table: "VitalSigns",
                column: "AdmissionId",
                principalTable: "Admission",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VitalSigns_Admission_AdmissionId",
                table: "VitalSigns");

            migrationBuilder.DropTable(
                name: "BaseVitalSigns");

            migrationBuilder.DropIndex(
                name: "IX_VitalSigns_AdmissionId",
                table: "VitalSigns");

            migrationBuilder.DropColumn(
                name: "AdmissionId",
                table: "VitalSigns");

            migrationBuilder.AlterColumn<double>(
                name: "OxygenSaturationAtRest",
                table: "VitalSigns",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DominantHand",
                table: "VitalSigns",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Height",
                table: "VitalSigns",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "LeftBicep",
                table: "VitalSigns",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "LeftCalf",
                table: "VitalSigns",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "LeftForearm",
                table: "VitalSigns",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "LeftThigh",
                table: "VitalSigns",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "OxygenAmount",
                table: "VitalSigns",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OxygenUse",
                table: "VitalSigns",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "RightBicep",
                table: "VitalSigns",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "RightCalf",
                table: "VitalSigns",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "RightForearm",
                table: "VitalSigns",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "RightThigh",
                table: "VitalSigns",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Weight",
                table: "VitalSigns",
                nullable: true);
        }
    }
}
