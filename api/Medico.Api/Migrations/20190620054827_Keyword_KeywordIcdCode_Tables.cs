using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Keyword_KeywordIcdCode_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                name: "KeywordIcdCode",
                columns: table => new
                {
                    KeywordId = table.Column<Guid>(nullable: false),
                    IcdCodeId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KeywordIcdCode", x => new { x.IcdCodeId, x.KeywordId });
                    table.ForeignKey(
                        name: "FK_KeywordIcdCode_IcdCode_IcdCodeId",
                        column: x => x.IcdCodeId,
                        principalTable: "IcdCode",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KeywordIcdCode_Keyword_KeywordId",
                        column: x => x.KeywordId,
                        principalTable: "Keyword",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KeywordIcdCode_KeywordId",
                table: "KeywordIcdCode",
                column: "KeywordId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KeywordIcdCode");

            migrationBuilder.DropTable(
                name: "Keyword");
        }
    }
}
