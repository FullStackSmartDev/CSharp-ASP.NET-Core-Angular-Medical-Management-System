using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class FamilyHistory_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FamilyHistory",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    FamilyMember = table.Column<int>(nullable: false),
                    FamilyStatus = table.Column<int>(nullable: false),
                    CptCodeId = table.Column<Guid>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    CreatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamilyHistory_CptCode_CptCodeId",
                        column: x => x.CptCodeId,
                        principalTable: "CptCode",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FamilyHistory_PatientDemographic_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientDemographic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FamilyHistory_CptCodeId",
                table: "FamilyHistory",
                column: "CptCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyHistory_PatientId",
                table: "FamilyHistory",
                column: "PatientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FamilyHistory");
        }
    }
}
