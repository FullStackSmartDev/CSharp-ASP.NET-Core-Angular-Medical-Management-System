using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_PatientChartNodeDocument_Table_Remove_PatientChartConfig_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PatientChartConfig");

            migrationBuilder.CreateTable(
                name: "PatientChartDocumentNode",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    CompanyId = table.Column<Guid>(nullable: false),
                    Title = table.Column<string>(maxLength: 2000, nullable: false),
                    Name = table.Column<string>(maxLength: 2000, nullable: false),
                    PatientChartDocumentNodeJsonString = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientChartDocumentNode", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientChartDocumentNode_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PatientChartDocumentNode_CompanyId",
                table: "PatientChartDocumentNode",
                column: "CompanyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PatientChartDocumentNode");

            migrationBuilder.CreateTable(
                name: "PatientChartConfig",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    CompanyId = table.Column<Guid>(nullable: false),
                    PatientChartJsonConfig = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientChartConfig", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientChartConfig_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PatientChartConfig_CompanyId",
                table: "PatientChartConfig",
                column: "CompanyId",
                unique: true);
        }
    }
}
