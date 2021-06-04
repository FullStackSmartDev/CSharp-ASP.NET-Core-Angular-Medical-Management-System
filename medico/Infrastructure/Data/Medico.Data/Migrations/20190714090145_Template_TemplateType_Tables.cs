using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Template_TemplateType_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TemplateType",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    IsActive = table.Column<bool>(nullable: false),
                    IsPredefined = table.Column<bool>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(maxLength: 100, nullable: false),
                    Title = table.Column<string>(maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplateType", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TemplateType_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Template",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    IsActive = table.Column<bool>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    TemplateOrder = table.Column<int>(nullable: true),
                    Name = table.Column<string>(maxLength: 2000, nullable: false),
                    Title = table.Column<string>(maxLength: 2000, nullable: false),
                    ReportTitle = table.Column<string>(maxLength: 2000, nullable: false),
                    DetailedTemplateHtml = table.Column<string>(nullable: true),
                    DefaultTemplateHtml = table.Column<string>(nullable: true),
                    IsRequired = table.Column<bool>(nullable: false),
                    IsHistorical = table.Column<bool>(nullable: false),
                    TemplateTypeId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Template", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Template_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Template_TemplateType_TemplateTypeId",
                        column: x => x.TemplateTypeId,
                        principalTable: "TemplateType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Template_CompanyId",
                table: "Template",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Template_TemplateTypeId",
                table: "Template",
                column: "TemplateTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_TemplateType_CompanyId",
                table: "TemplateType",
                column: "CompanyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Template");

            migrationBuilder.DropTable(
                name: "TemplateType");
        }
    }
}
