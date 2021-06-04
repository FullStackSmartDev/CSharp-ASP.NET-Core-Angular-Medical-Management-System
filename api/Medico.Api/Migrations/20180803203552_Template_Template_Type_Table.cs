using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Template_Template_Type_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TemplateType",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    CompanyId = table.Column<Guid>(nullable: true),
                    Name = table.Column<string>(nullable: false),
                    Title = table.Column<string>(maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplateType", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TemplateType_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Template",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: true),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    CompanyId = table.Column<Guid>(nullable: true),
                    Name = table.Column<string>(nullable: false),
                    Title = table.Column<string>(maxLength: 200, nullable: true),
                    Value = table.Column<string>(nullable: false),
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
                        onDelete: ReferentialAction.Restrict);
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
