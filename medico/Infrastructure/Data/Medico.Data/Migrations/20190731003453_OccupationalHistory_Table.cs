using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class OccupationalHistory_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OccupationalHistory",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    OccupationalType = table.Column<string>(maxLength: 2000, nullable: false),
                    Start = table.Column<DateTime>(nullable: false),
                    End = table.Column<DateTime>(nullable: true),
                    DisabilityClaimDetails = table.Column<string>(maxLength: 2000, nullable: true),
                    WorkersCompensationClaimDetails = table.Column<string>(maxLength: 2000, nullable: true),
                    EmploymentStatus = table.Column<string>(maxLength: 100, nullable: false),
                    Notes = table.Column<string>(maxLength: 2000, nullable: true),
                    PatientId = table.Column<Guid>(nullable: false),
                    CreateDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OccupationalHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OccupationalHistory_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OccupationalHistory_PatientId",
                table: "OccupationalHistory",
                column: "PatientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OccupationalHistory");
        }
    }
}
