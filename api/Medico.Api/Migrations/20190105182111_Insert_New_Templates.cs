using System;
using System.IO;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
  public partial class Insert_New_Templates : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      var sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"DB/Scripts/insertNewTemplates.sql");
      migrationBuilder.Sql(File.ReadAllText(sqlFile));
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.Sql("DELETE FROM Template");
    }
  }
}
