using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_Expression_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Expression",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    LibraryExpressionId = table.Column<Guid>(nullable: true),
                    Version = table.Column<int>(nullable: true),
                    CompanyId = table.Column<Guid>(nullable: true),
                    Title = table.Column<string>(maxLength: 2000, nullable: false),
                    Template = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Expression", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Expression_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Expression_Expression_LibraryExpressionId",
                        column: x => x.LibraryExpressionId,
                        principalTable: "Expression",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Expression_CompanyId",
                table: "Expression",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Expression_LibraryExpressionId",
                table: "Expression",
                column: "LibraryExpressionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Expression");
        }
    }
}
