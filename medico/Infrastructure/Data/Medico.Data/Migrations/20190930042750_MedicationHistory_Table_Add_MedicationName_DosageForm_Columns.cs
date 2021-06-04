using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class MedicationHistory_Table_Add_MedicationName_DosageForm_Columns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DoseSchedule",
                table: "MedicationHistory");

            migrationBuilder.AlterColumn<string>(
                name: "Dose",
                table: "MedicationHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(int),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DosageForm",
                table: "MedicationHistory",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "MedicationNameId",
                table: "MedicationHistory",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MedicationHistory_MedicationNameId",
                table: "MedicationHistory",
                column: "MedicationNameId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicationHistory_MedicationName_MedicationNameId",
                table: "MedicationHistory",
                column: "MedicationNameId",
                principalTable: "MedicationName",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicationHistory_MedicationName_MedicationNameId",
                table: "MedicationHistory");

            migrationBuilder.DropIndex(
                name: "IX_MedicationHistory_MedicationNameId",
                table: "MedicationHistory");

            migrationBuilder.DropColumn(
                name: "DosageForm",
                table: "MedicationHistory");

            migrationBuilder.DropColumn(
                name: "MedicationNameId",
                table: "MedicationHistory");

            migrationBuilder.AlterColumn<int>(
                name: "Dose",
                table: "MedicationHistory",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DoseSchedule",
                table: "MedicationHistory",
                maxLength: 100,
                nullable: true);
        }
    }
}
