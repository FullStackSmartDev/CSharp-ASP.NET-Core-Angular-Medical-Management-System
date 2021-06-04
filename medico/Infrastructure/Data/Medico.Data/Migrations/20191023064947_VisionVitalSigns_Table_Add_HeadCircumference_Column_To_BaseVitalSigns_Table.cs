using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class VisionVitalSigns_Table_Add_HeadCircumference_Column_To_BaseVitalSigns_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "HeadCircumference",
                table: "BaseVitalSigns",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "VisualVitalSignsId",
                table: "Admission",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "VisionVitalSigns",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    PatientId = table.Column<Guid>(nullable: false),
                    WithGlasses = table.Column<bool>(nullable: false, defaultValue: false),
                    Od = table.Column<int>(nullable: false),
                    Os = table.Column<int>(nullable: false),
                    Ou = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisionVitalSigns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VisionVitalSigns_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Admission_VisualVitalSignsId",
                table: "Admission",
                column: "VisualVitalSignsId");

            migrationBuilder.CreateIndex(
                name: "IX_VisionVitalSigns_PatientId",
                table: "VisionVitalSigns",
                column: "PatientId");

            migrationBuilder.AddForeignKey(
                name: "FK_Admission_VisionVitalSigns_VisualVitalSignsId",
                table: "Admission",
                column: "VisualVitalSignsId",
                principalTable: "VisionVitalSigns",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Admission_VisionVitalSigns_VisualVitalSignsId",
                table: "Admission");

            migrationBuilder.DropTable(
                name: "VisionVitalSigns");

            migrationBuilder.DropIndex(
                name: "IX_Admission_VisualVitalSignsId",
                table: "Admission");

            migrationBuilder.DropColumn(
                name: "HeadCircumference",
                table: "BaseVitalSigns");

            migrationBuilder.DropColumn(
                name: "VisualVitalSignsId",
                table: "Admission");
        }
    }
}
