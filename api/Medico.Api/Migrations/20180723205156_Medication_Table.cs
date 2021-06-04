using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Medication_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Medication",
                columns: table => new
                {
                    IsDelete = table.Column<bool>(nullable: false, defaultValue: false),
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    NdcCode = table.Column<string>(nullable: true),
                    PackageDescription = table.Column<string>(nullable: true),
                    ProductNdc = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: false),
                    GenericName = table.Column<string>(nullable: true),
                    Form = table.Column<string>(nullable: true),
                    Route = table.Column<string>(nullable: true),
                    Substance = table.Column<string>(nullable: true),
                    Strength = table.Column<string>(nullable: true),
                    Units = table.Column<string>(nullable: true),
                    Class = table.Column<string>(nullable: true),
                    Schedule = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Medication", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Medication");
        }
    }
}
