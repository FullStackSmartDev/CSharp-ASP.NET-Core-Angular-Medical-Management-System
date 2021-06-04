using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class PatientChartDocumentId_Column_To_Appointment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PatientChartDocumentId",
                table: "Appointment",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_PatientChartDocumentId",
                table: "Appointment",
                column: "PatientChartDocumentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_PatientChartDocumentNode_PatientChartDocumentId",
                table: "Appointment",
                column: "PatientChartDocumentId",
                principalTable: "PatientChartDocumentNode",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_PatientChartDocumentNode_PatientChartDocumentId",
                table: "Appointment");

            migrationBuilder.DropIndex(
                name: "IX_Appointment_PatientChartDocumentId",
                table: "Appointment");

            migrationBuilder.DropColumn(
                name: "PatientChartDocumentId",
                table: "Appointment");
        }
    }
}
