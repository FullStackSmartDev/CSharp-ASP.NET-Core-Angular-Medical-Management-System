using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class PatientInsurance_Table_Address_Columns_Optional_To_PatientDemographic : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "PatientDemographic",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "PatientDemographic",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MiddleName",
                table: "PatientDemographic",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PatientInsuranceId",
                table: "PatientDemographic",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryAddress",
                table: "PatientDemographic",
                maxLength: 400,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryPhone",
                table: "PatientDemographic",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondaryAddress",
                table: "PatientDemographic",
                maxLength: 400,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondaryPhone",
                table: "PatientDemographic",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "State",
                table: "PatientDemographic",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "PatientInsurance",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    PatientDemographicId = table.Column<Guid>(nullable: false),
                    RelationshipCode = table.Column<string>(maxLength: 100, nullable: true),
                    DependentCode = table.Column<string>(maxLength: 100, nullable: true),
                    FirstName = table.Column<string>(maxLength: 100, nullable: false),
                    MiddleName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(maxLength: 100, nullable: false),
                    Gender = table.Column<int>(nullable: false),
                    DateOfBirth = table.Column<DateTime>(nullable: false),
                    Ssn = table.Column<string>(maxLength: 100, nullable: false),
                    PrimaryAddress = table.Column<string>(maxLength: 400, nullable: false),
                    SecondaryAddress = table.Column<string>(maxLength: 400, nullable: true),
                    City = table.Column<string>(maxLength: 100, nullable: false),
                    PrimaryPhone = table.Column<string>(maxLength: 100, nullable: false),
                    SecondaryPhone = table.Column<string>(maxLength: 100, nullable: true),
                    Email = table.Column<string>(maxLength: 100, nullable: false),
                    State = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientInsurance", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PatientDemographic_PatientInsuranceId",
                table: "PatientDemographic",
                column: "PatientInsuranceId",
                unique: true,
                filter: "[PatientInsuranceId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_PatientDemographic_PatientInsurance_PatientInsuranceId",
                table: "PatientDemographic",
                column: "PatientInsuranceId",
                principalTable: "PatientInsurance",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PatientDemographic_PatientInsurance_PatientInsuranceId",
                table: "PatientDemographic");

            migrationBuilder.DropTable(
                name: "PatientInsurance");

            migrationBuilder.DropIndex(
                name: "IX_PatientDemographic_PatientInsuranceId",
                table: "PatientDemographic");

            migrationBuilder.DropColumn(
                name: "City",
                table: "PatientDemographic");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "PatientDemographic");

            migrationBuilder.DropColumn(
                name: "MiddleName",
                table: "PatientDemographic");

            migrationBuilder.DropColumn(
                name: "PatientInsuranceId",
                table: "PatientDemographic");

            migrationBuilder.DropColumn(
                name: "PrimaryAddress",
                table: "PatientDemographic");

            migrationBuilder.DropColumn(
                name: "PrimaryPhone",
                table: "PatientDemographic");

            migrationBuilder.DropColumn(
                name: "SecondaryAddress",
                table: "PatientDemographic");

            migrationBuilder.DropColumn(
                name: "SecondaryPhone",
                table: "PatientDemographic");

            migrationBuilder.DropColumn(
                name: "State",
                table: "PatientDemographic");
        }
    }
}
