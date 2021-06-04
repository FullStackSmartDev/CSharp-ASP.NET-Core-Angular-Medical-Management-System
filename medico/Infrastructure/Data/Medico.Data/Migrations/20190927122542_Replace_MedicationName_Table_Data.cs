using System;
using System.IO;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Replace_MedicationName_Table_Data : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM MedicationName");

            var sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"SqlScripts/medicationNames.sql");
            if (!File.Exists(sqlFile))
                throw new InvalidOperationException("Unable to find sql data script");

            migrationBuilder.Sql(File.ReadAllText(sqlFile));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
