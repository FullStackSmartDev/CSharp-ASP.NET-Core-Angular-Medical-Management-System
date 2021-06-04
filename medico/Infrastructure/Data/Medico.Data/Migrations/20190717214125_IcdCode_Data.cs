using System;
using System.Diagnostics;
using System.IO;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class IcdCode_Data : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"SqlScripts/icd10Codes.sql");
            if (!File.Exists(sqlFile))
                throw new InvalidOperationException("Unable to find sql data script");

            migrationBuilder.Sql(File.ReadAllText(sqlFile));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM IcdCode");
        }
    }
}
