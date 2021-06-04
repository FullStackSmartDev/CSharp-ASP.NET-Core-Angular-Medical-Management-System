using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class VitalSignsNotes_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreateDate",
                table: "VisionVitalSigns",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldDefaultValue: new DateTime(2019, 11, 10, 18, 58, 40, 456, DateTimeKind.Utc).AddTicks(4971));

            migrationBuilder.AddColumn<Guid>(
                name: "VitalSignsNotesId",
                table: "Admission",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "VitalSignsNotes",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    AdmissionId = table.Column<Guid>(nullable: false),
                    Notes = table.Column<string>(maxLength: 4000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VitalSignsNotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VitalSignsNotes_Admission_AdmissionId",
                        column: x => x.AdmissionId,
                        principalTable: "Admission",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VitalSignsNotes_AdmissionId",
                table: "VitalSignsNotes",
                column: "AdmissionId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VitalSignsNotes");

            migrationBuilder.DropColumn(
                name: "VitalSignsNotesId",
                table: "Admission");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreateDate",
                table: "VisionVitalSigns",
                nullable: false,
                defaultValue: new DateTime(2019, 11, 10, 18, 58, 40, 456, DateTimeKind.Utc).AddTicks(4971),
                oldClrType: typeof(DateTime),
                oldDefaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
