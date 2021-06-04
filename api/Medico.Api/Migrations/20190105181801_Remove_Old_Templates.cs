using System;
using System.IO;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
  public partial class Remove_Old_Templates : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.Sql("DELETE FROM Template");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      var sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"DB/Scripts/insertOldTemplates.sql");
      migrationBuilder.Sql(File.ReadAllText(sqlFile));
    }
  }
}
