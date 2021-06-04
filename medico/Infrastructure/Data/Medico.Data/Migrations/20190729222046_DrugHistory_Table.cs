using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class DrugHistory_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DrugHistory",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    Route = table.Column<string>(maxLength: 100, nullable: true),
                    Status = table.Column<string>(maxLength: 100, nullable: true),
                    Type = table.Column<string>(maxLength: 100, nullable: true),
                    Amount = table.Column<int>(nullable: true),
                    Use = table.Column<string>(maxLength: 100, nullable: true),
                    Frequency = table.Column<string>(maxLength: 100, nullable: true),
                    Length = table.Column<int>(nullable: true),
                    Duration = table.Column<string>(maxLength: 100, nullable: true),
                    Quit = table.Column<bool>(nullable: true),
                    StatusLength = table.Column<int>(nullable: true),
                    Notes = table.Column<string>(maxLength: 2000, nullable: true),
                    CreateDate = table.Column<DateTime>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    StatusLengthType = table.Column<string>(maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrugHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DrugHistory_Patient_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patient",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DrugHistory_PatientId",
                table: "DrugHistory",
                column: "PatientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DrugHistory");
        }
    }
}
