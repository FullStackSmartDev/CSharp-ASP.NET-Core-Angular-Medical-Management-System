using System;
using System.IO;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Update_ICD10_Codes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM IcdCode");

            var sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"DB/Scripts/icd10Codes.sql");
            migrationBuilder.Sql(File.ReadAllText(sqlFile));
        }
    }
}
