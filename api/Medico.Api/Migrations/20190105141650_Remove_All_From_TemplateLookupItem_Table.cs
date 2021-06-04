using System;
using System.IO;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
  public partial class Remove_All_From_TemplateLookupItem_Table : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.Sql(@"DELETE FROM TemplateLookupItem");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      var sqlFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"DB/Scripts/insertOldTemplateLookupItems.sql");
      migrationBuilder.Sql(File.ReadAllText(sqlFile));
    }
  }
}
