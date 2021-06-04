using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_ReferenceTable_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReferenceTable",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    LibraryReferenceTableId = table.Column<Guid>(nullable: true),
                    Version = table.Column<int>(nullable: true),
                    CompanyId = table.Column<Guid>(nullable: true),
                    Title = table.Column<string>(maxLength: 2000, nullable: false),
                    Data = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReferenceTable", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReferenceTable_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReferenceTable_ReferenceTable_LibraryReferenceTableId",
                        column: x => x.LibraryReferenceTableId,
                        principalTable: "ReferenceTable",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReferenceTable_CompanyId",
                table: "ReferenceTable",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_ReferenceTable_LibraryReferenceTableId",
                table: "ReferenceTable",
                column: "LibraryReferenceTableId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReferenceTable");
        }
    }
}
