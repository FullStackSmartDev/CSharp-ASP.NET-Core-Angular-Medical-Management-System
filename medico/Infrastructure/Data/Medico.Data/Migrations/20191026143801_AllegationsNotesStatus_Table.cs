using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class AllegationsNotesStatus_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AllegationsNotesStatusId",
                table: "Admission",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AllegationsNotesStatus",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    AdmissionId = table.Column<Guid>(nullable: false),
                    IsReviewed = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AllegationsNotesStatus", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Admission_AllegationsNotesStatusId",
                table: "Admission",
                column: "AllegationsNotesStatusId",
                unique: true,
                filter: "[AllegationsNotesStatusId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Admission_AllegationsNotesStatus_AllegationsNotesStatusId",
                table: "Admission",
                column: "AllegationsNotesStatusId",
                principalTable: "AllegationsNotesStatus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Admission_AllegationsNotesStatus_AllegationsNotesStatusId",
                table: "Admission");

            migrationBuilder.DropTable(
                name: "AllegationsNotesStatus");

            migrationBuilder.DropIndex(
                name: "IX_Admission_AllegationsNotesStatusId",
                table: "Admission");

            migrationBuilder.DropColumn(
                name: "AllegationsNotesStatusId",
                table: "Admission");
        }
    }
}
