using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_Tables_TobaccoHistory_AlcoholHistory_DrugHistory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AlcoholHistory",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    Amount = table.Column<int>(nullable: false),
                    Length = table.Column<int>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    Quit = table.Column<bool>(nullable: false, defaultValue: true),
                    Status = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Use = table.Column<string>(nullable: true),
                    Frequency = table.Column<string>(nullable: true),
                    Duration = table.Column<string>(nullable: true),
                    StatusLength = table.Column<string>(nullable: true),
                    Notes = table.Column<string>(nullable: true),
                    StatusLengthType = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlcoholHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AlcoholHistory_PatientDemographic_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientDemographic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DrugHistory",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    Amount = table.Column<int>(nullable: false),
                    Length = table.Column<int>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    Quit = table.Column<bool>(nullable: false, defaultValue: true),
                    Status = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Use = table.Column<string>(nullable: true),
                    Frequency = table.Column<string>(nullable: true),
                    Duration = table.Column<string>(nullable: true),
                    StatusLength = table.Column<string>(nullable: true),
                    Notes = table.Column<string>(nullable: true),
                    StatusLengthType = table.Column<string>(nullable: true),
                    Route = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrugHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DrugHistory_PatientDemographic_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientDemographic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TobaccoHistory",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    Amount = table.Column<int>(nullable: false),
                    Length = table.Column<int>(nullable: false),
                    PatientId = table.Column<Guid>(nullable: false),
                    Quit = table.Column<bool>(nullable: false, defaultValue: true),
                    Status = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Use = table.Column<string>(nullable: true),
                    Frequency = table.Column<string>(nullable: true),
                    Duration = table.Column<string>(nullable: true),
                    StatusLength = table.Column<string>(nullable: true),
                    Notes = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TobaccoHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TobaccoHistory_PatientDemographic_PatientId",
                        column: x => x.PatientId,
                        principalTable: "PatientDemographic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AlcoholHistory_PatientId",
                table: "AlcoholHistory",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_DrugHistory_PatientId",
                table: "DrugHistory",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_TobaccoHistory_PatientId",
                table: "TobaccoHistory",
                column: "PatientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlcoholHistory");

            migrationBuilder.DropTable(
                name: "DrugHistory");

            migrationBuilder.DropTable(
                name: "TobaccoHistory");
        }
    }
}
