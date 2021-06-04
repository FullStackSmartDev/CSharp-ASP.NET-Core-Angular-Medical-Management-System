using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Data.Migrations
{
    public partial class Add_ContentWithDefaultSelectableItemsValues_Column_To_Phrase_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContentWithDefaultSelectableItemsValues",
                table: "Phrase",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ContentWithDefaultSelectableItemsValues",
                table: "Phrase");
        }
    }
}