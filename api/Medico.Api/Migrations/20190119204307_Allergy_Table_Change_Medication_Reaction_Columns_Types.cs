using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Allergy_Table_Change_Medication_Reaction_Columns_Types : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Allergy_Medication_MedicationId",
                table: "Allergy");

            migrationBuilder.DropIndex(
                name: "IX_Allergy_MedicationId",
                table: "Allergy");

            migrationBuilder.DropColumn(
                name: "MedicationId",
                table: "Allergy");

            migrationBuilder.AlterColumn<string>(
                name: "Reaction",
                table: "Allergy",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<string>(
                name: "Medication",
                table: "Allergy",
                maxLength: 400,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Medication",
                table: "Allergy");

            migrationBuilder.AlterColumn<int>(
                name: "Reaction",
                table: "Allergy",
                nullable: false,
                oldClrType: typeof(string),
                oldMaxLength: 200);

            migrationBuilder.AddColumn<Guid>(
                name: "MedicationId",
                table: "Allergy",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Allergy_MedicationId",
                table: "Allergy",
                column: "MedicationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Allergy_Medication_MedicationId",
                table: "Allergy",
                column: "MedicationId",
                principalTable: "Medication",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
