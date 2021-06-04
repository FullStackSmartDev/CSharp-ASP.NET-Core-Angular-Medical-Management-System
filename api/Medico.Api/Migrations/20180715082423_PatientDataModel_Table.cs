using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class PatientDataModel_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PatientDataModelId",
                table: "Company",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PatientDataModel",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    CompanyId = table.Column<Guid>(nullable: true),
                    JsonPatientDataModel = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientDataModel", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientDataModel_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PatientDataModel_CompanyId",
                table: "PatientDataModel",
                column: "CompanyId",
                unique: true,
                filter: "[CompanyId] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PatientDataModel");

            migrationBuilder.DropColumn(
                name: "PatientDataModelId",
                table: "Company");
        }
    }
}
