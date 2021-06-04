using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class PatientChartConfig_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PatientChartConfigId",
                table: "Company",
                nullable: true);

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PatientChartConfig");

            migrationBuilder.DropColumn(
                name: "PatientChartConfigId",
                table: "Company");
        }
    }
}
