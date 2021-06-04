using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Add_SuperAdmin_User : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"INSERT INTO AppUser (Hash, Login, IsSuperAdmin)
                                   VALUES('U2FsdGVkX19NDUzXNw4WYmWUWd5Y6pDcE/oN2hQfWGY=', 'superadmin@mail.com', 1)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM AppUser WHERE IsSuperAdmin = 1");

        }
    }
}
