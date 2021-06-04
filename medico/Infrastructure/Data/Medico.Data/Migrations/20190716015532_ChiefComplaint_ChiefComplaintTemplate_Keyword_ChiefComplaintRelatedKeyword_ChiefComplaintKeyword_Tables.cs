using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class ChiefComplaint_ChiefComplaintTemplate_Keyword_ChiefComplaintRelatedKeyword_ChiefComplaintKeyword_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChiefComplaint",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    Name = table.Column<string>(maxLength: 2000, nullable: false),
                    Title = table.Column<string>(maxLength: 2000, nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiefComplaint", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChiefComplaint_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChiefComplaintKeyword",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    Value = table.Column<string>(maxLength: 2000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiefComplaintKeyword", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Keyword",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    Value = table.Column<string>(maxLength: 2000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Keyword", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ChiefComplaintTemplate",
                columns: table => new
                {
                    ChiefComplaintId = table.Column<Guid>(nullable: false),
                    TemplateId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiefComplaintTemplate", x => new { x.ChiefComplaintId, x.TemplateId });
                    table.ForeignKey(
                        name: "FK_ChiefComplaintTemplate_ChiefComplaint_ChiefComplaintId",
                        column: x => x.ChiefComplaintId,
                        principalTable: "ChiefComplaint",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ChiefComplaintTemplate_Template_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "Template",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChiefComplaintRelatedKeyword",
                columns: table => new
                {
                    ChiefComplaintId = table.Column<Guid>(nullable: false),
                    KeywordId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiefComplaintRelatedKeyword", x => new { x.ChiefComplaintId, x.KeywordId });
                    table.ForeignKey(
                        name: "FK_ChiefComplaintRelatedKeyword_ChiefComplaint_ChiefComplaintId",
                        column: x => x.ChiefComplaintId,
                        principalTable: "ChiefComplaint",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChiefComplaintRelatedKeyword_ChiefComplaintKeyword_KeywordId",
                        column: x => x.KeywordId,
                        principalTable: "ChiefComplaintKeyword",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChiefComplaint_CompanyId",
                table: "ChiefComplaint",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_ChiefComplaintRelatedKeyword_KeywordId",
                table: "ChiefComplaintRelatedKeyword",
                column: "KeywordId");

            migrationBuilder.CreateIndex(
                name: "IX_ChiefComplaintTemplate_TemplateId",
                table: "ChiefComplaintTemplate",
                column: "TemplateId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiefComplaintRelatedKeyword");

            migrationBuilder.DropTable(
                name: "ChiefComplaintTemplate");

            migrationBuilder.DropTable(
                name: "Keyword");

            migrationBuilder.DropTable(
                name: "ChiefComplaintKeyword");

            migrationBuilder.DropTable(
                name: "ChiefComplaint");
        }
    }
}
