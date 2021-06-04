using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class SurgicalHistory_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SurgicalHistory",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    CptCodeId = table.Column<Guid>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    Notes = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SurgicalHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SurgicalHistory_CptCode_CptCodeId",
                        column: x => x.CptCodeId,
                        principalTable: "CptCode",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SurgicalHistory_PatientDemographic_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientDemographic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SurgicalHistory_CptCodeId",
                table: "SurgicalHistory",
                column: "CptCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_SurgicalHistory_PatientId",
                table: "SurgicalHistory",
                column: "PatientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SurgicalHistory");
        }
    }
}
