using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class IcdCodeChiefComplaintKeyword_IcdCode_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Keyword");

            migrationBuilder.CreateTable(
                name: "IcdCode",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    Code = table.Column<string>(maxLength: 100, nullable: false),
                    Name = table.Column<string>(maxLength: 2000, nullable: false),
                    Notes = table.Column<string>(maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IcdCode", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IcdCodeChiefComplaintKeyword",
                columns: table => new
                {
                    ChiefComplaintKeywordId = table.Column<Guid>(nullable: false),
                    IcdCodeId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IcdCodeChiefComplaintKeyword", x => new { x.IcdCodeId, x.ChiefComplaintKeywordId });
                    table.ForeignKey(
                        name: "FK_IcdCodeChiefComplaintKeyword_ChiefComplaintKeyword_ChiefComplaintKeywordId",
                        column: x => x.ChiefComplaintKeywordId,
                        principalTable: "ChiefComplaintKeyword",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IcdCodeChiefComplaintKeyword_IcdCode_IcdCodeId",
                        column: x => x.IcdCodeId,
                        principalTable: "IcdCode",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IcdCodeChiefComplaintKeyword_ChiefComplaintKeywordId",
                table: "IcdCodeChiefComplaintKeyword",
                column: "ChiefComplaintKeywordId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IcdCodeChiefComplaintKeyword");

            migrationBuilder.DropTable(
                name: "IcdCode");

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
        }
    }
}
