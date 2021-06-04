using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Company_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Company",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    Name = table.Column<string>(maxLength: 2000, nullable: false),
                    Address = table.Column<string>(maxLength: 2000, nullable: false),
                    SecondaryAddress = table.Column<string>(maxLength: 2000, nullable: true),
                    City = table.Column<string>(maxLength: 100, nullable: false),
                    State = table.Column<int>(nullable: false),
                    ZipCode = table.Column<string>(maxLength: 100, nullable: false),
                    Phone = table.Column<string>(maxLength: 100, nullable: false),
                    Fax = table.Column<string>(maxLength: 100, nullable: false),
                    WebSiteUrl = table.Column<string>(maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Company", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Company");
        }
    }
}
