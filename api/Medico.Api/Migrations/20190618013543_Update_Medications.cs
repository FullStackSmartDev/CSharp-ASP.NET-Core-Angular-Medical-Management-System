using System;
using System.IO;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Update_Medications : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM Medication");

            var sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"DB/Scripts/medication.sql");
            migrationBuilder.Sql(File.ReadAllText(sqlFile));
        }
    }
}
