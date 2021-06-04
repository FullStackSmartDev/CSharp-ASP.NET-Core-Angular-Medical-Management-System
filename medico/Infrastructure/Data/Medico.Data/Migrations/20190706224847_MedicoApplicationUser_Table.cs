using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class MedicoApplicationUser_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MedicoApplicationUser",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false, defaultValueSql: "newsequentialid()"),
                    IsActive = table.Column<bool>(nullable: false),
                    CompanyId = table.Column<Guid>(nullable: false),
                    FirstName = table.Column<string>(maxLength: 100, nullable: false),
                    NamePrefix = table.Column<string>(maxLength: 100, nullable: true),
                    NameSuffix = table.Column<string>(maxLength: 100, nullable: true),
                    MiddleName = table.Column<string>(maxLength: 100, nullable: true),
                    LastName = table.Column<string>(maxLength: 100, nullable: false),
                    Email = table.Column<string>(maxLength: 100, nullable: false),
                    Address = table.Column<string>(maxLength: 2000, nullable: false),
                    SecondaryAddress = table.Column<string>(maxLength: 2000, nullable: true),
                    City = table.Column<string>(maxLength: 100, nullable: false),
                    State = table.Column<int>(nullable: false),
                    Zip = table.Column<string>(maxLength: 100, nullable: false),
                    PrimaryPhone = table.Column<string>(maxLength: 100, nullable: false),
                    SecondaryPhone = table.Column<string>(maxLength: 100, nullable: true),
                    EmployeeType = table.Column<int>(nullable: false),
                    Ssn = table.Column<string>(maxLength: 100, nullable: false),
                    Gender = table.Column<int>(nullable: false),
                    DateOfBirth = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicoApplicationUser", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MedicoApplicationUser_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MedicoApplicationUser_CompanyId",
                table: "MedicoApplicationUser",
                column: "CompanyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicoApplicationUser");
        }
    }
}
