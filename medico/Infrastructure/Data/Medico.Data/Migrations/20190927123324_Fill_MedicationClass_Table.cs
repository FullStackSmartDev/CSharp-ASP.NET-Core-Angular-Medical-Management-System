using System;
using System.IO;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Fill_MedicationClass_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"SqlScripts/medicationClasses.sql");
            if (!File.Exists(sqlFile))
                throw new InvalidOperationException("Unable to find sql data script");

            migrationBuilder.Sql(File.ReadAllText(sqlFile));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM MedicationClass");
        }
    }
}
