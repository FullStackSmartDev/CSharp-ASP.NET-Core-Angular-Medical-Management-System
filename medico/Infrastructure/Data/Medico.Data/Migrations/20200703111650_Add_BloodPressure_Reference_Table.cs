using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_BloodPressure_Reference_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "ReferenceTable",
                columns: new[] { "Id", "CompanyId", "Data", "LibraryReferenceTableId", "Title", "Version" },
                values: new object[] { new Guid("9afeec1e-8642-4003-8249-8132840f1bf8"), null, "{\"header\":[{\"title\":\"Id\",\"type\":\"string\",\"visible\":false},{\"title\":\"Title\",\"type\":\"string\",\"visible\":true},{\"title\":\"Template\",\"type\":\"string\",\"visible\":true},{\"title\":\"MaxAge\",\"type\":\"number\",\"visible\":true},{\"title\":\"MinAge\",\"type\":\"number\",\"visible\":true},{\"title\":\"MinValue\",\"type\":\"number\",\"visible\":true},{\"title\":\"MaxValue\",\"type\":\"number\",\"visible\":true}],\"body\":[]}", null, "Blood Pressure", 1 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ReferenceTable",
                keyColumn: "Id",
                keyValue: new Guid("9afeec1e-8642-4003-8249-8132840f1bf8"));
        }
    }
}
