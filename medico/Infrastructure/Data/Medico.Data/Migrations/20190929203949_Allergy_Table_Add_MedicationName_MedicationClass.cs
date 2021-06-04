using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Allergy_Table_Add_MedicationName_MedicationClass : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "MedicationClassId",
                table: "Allergy",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "MedicationNameId",
                table: "Allergy",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Allergy_MedicationClassId",
                table: "Allergy",
                column: "MedicationClassId");

            migrationBuilder.CreateIndex(
                name: "IX_Allergy_MedicationNameId",
                table: "Allergy",
                column: "MedicationNameId");

            migrationBuilder.AddForeignKey(
                name: "FK_Allergy_MedicationClass_MedicationClassId",
                table: "Allergy",
                column: "MedicationClassId",
                principalTable: "MedicationClass",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Allergy_MedicationName_MedicationNameId",
                table: "Allergy",
                column: "MedicationNameId",
                principalTable: "MedicationName",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Allergy_MedicationClass_MedicationClassId",
                table: "Allergy");

            migrationBuilder.DropForeignKey(
                name: "FK_Allergy_MedicationName_MedicationNameId",
                table: "Allergy");

            migrationBuilder.DropIndex(
                name: "IX_Allergy_MedicationClassId",
                table: "Allergy");

            migrationBuilder.DropIndex(
                name: "IX_Allergy_MedicationNameId",
                table: "Allergy");

            migrationBuilder.DropColumn(
                name: "MedicationClassId",
                table: "Allergy");

            migrationBuilder.DropColumn(
                name: "MedicationNameId",
                table: "Allergy");
        }
    }
}
