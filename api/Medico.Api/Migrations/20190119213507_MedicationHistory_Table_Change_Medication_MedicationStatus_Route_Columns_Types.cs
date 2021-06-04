using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class MedicationHistory_Table_Change_Medication_MedicationStatus_Route_Columns_Types : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MedicationHistory_Medication_MedicationId",
                table: "MedicationHistory");

            migrationBuilder.DropIndex(
                name: "IX_MedicationHistory_MedicationId",
                table: "MedicationHistory");

            migrationBuilder.DropColumn(
                name: "MedicationId",
                table: "MedicationHistory");

            migrationBuilder.AlterColumn<string>(
                name: "Route",
                table: "MedicationHistory",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<string>(
                name: "MedicationStatus",
                table: "MedicationHistory",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<string>(
                name: "Medication",
                table: "MedicationHistory",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Medication",
                table: "MedicationHistory");

            migrationBuilder.AlterColumn<int>(
                name: "Route",
                table: "MedicationHistory",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<int>(
                name: "MedicationStatus",
                table: "MedicationHistory",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 200);

            migrationBuilder.AddColumn<Guid>(
                name: "MedicationId",
                table: "MedicationHistory",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_MedicationHistory_MedicationId",
                table: "MedicationHistory",
                column: "MedicationId");

            migrationBuilder.AddForeignKey(
                name: "FK_MedicationHistory_Medication_MedicationId",
                table: "MedicationHistory",
                column: "MedicationId",
                principalTable: "Medication",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
