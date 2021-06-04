using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Change_Medication_Table_Columns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Class",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "Form",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "GenericName",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "ProductNdc",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "Route",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "Schedule",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "Strength",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "Substance",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "Units",
                table: "Medication");

            migrationBuilder.AlterColumn<string>(
                name: "PackageDescription",
                table: "Medication",
                maxLength: 4000,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "NdcCode",
                table: "Medication",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeaSchedule",
                table: "Medication",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DosageFormName",
                table: "Medication",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ElevenDigitNdcCode",
                table: "Medication",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdate",
                table: "Medication",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NonProprietaryName",
                table: "Medication",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PharmaceuticalClasses",
                table: "Medication",
                maxLength: 4000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RouteName",
                table: "Medication",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Medication",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StrengthNumber",
                table: "Medication",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StrengthUnit",
                table: "Medication",
                maxLength: 4000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubstanceName",
                table: "Medication",
                maxLength: 4000,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeaSchedule",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "DosageFormName",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "ElevenDigitNdcCode",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "LastUpdate",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "NonProprietaryName",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "PharmaceuticalClasses",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "RouteName",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "StrengthNumber",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "StrengthUnit",
                table: "Medication");

            migrationBuilder.DropColumn(
                name: "SubstanceName",
                table: "Medication");

            migrationBuilder.AlterColumn<string>(
                name: "PackageDescription",
                table: "Medication",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 4000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "NdcCode",
                table: "Medication",
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 2000,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Class",
                table: "Medication",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Form",
                table: "Medication",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GenericName",
                table: "Medication",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDelete",
                table: "Medication",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Medication",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProductNdc",
                table: "Medication",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Route",
                table: "Medication",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Schedule",
                table: "Medication",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Strength",
                table: "Medication",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Substance",
                table: "Medication",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Medication",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Units",
                table: "Medication",
                nullable: true);
        }
    }
}
