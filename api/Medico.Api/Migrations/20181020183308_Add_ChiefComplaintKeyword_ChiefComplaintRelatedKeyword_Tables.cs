using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_ChiefComplaintKeyword_ChiefComplaintRelatedKeyword_Tables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChiefComplaintKeyword",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    Value = table.Column<string>(maxLength: 400, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChiefComplaintKeyword", x => x.Id);
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
                name: "IX_ChiefComplaintRelatedKeyword_KeywordId",
                table: "ChiefComplaintRelatedKeyword",
                column: "KeywordId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChiefComplaintRelatedKeyword");

            migrationBuilder.DropTable(
                name: "ChiefComplaintKeyword");
        }
    }
}
