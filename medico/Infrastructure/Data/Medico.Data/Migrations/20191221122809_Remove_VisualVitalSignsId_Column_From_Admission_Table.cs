using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Remove_VisualVitalSignsId_Column_From_Admission_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Admission_VisionVitalSigns_VisualVitalSignsId",
                table: "Admission");

            migrationBuilder.DropIndex(
                name: "IX_Admission_VisualVitalSignsId",
                table: "Admission");

            migrationBuilder.DropColumn(
                name: "VisualVitalSignsId",
                table: "Admission");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "VisualVitalSignsId",
                table: "Admission",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Admission_VisualVitalSignsId",
                table: "Admission",
                column: "VisualVitalSignsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Admission_VisionVitalSigns_VisualVitalSignsId",
                table: "Admission",
                column: "VisualVitalSignsId",
                principalTable: "VisionVitalSigns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
