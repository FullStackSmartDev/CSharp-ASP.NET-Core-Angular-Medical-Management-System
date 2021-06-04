using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Fill_HPI_Template_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"INSERT INTO Template (Name, Title, Value, TemplateTypeId)
                                VALUES ('hpi', 'HPI', '{""defaultTemplateValue"": ""Default"",""templateChunks"": [""complains of"",{""type"": ""db"",""table"": ""documentation.documentation.durationMod""},{""type"": ""db"",""table"": ""documentation.chiefComplaint""},""onset"",{""type"": ""range"",""min"": 0,""max"": 60},{""type"": ""db"",""table"": ""documentation.duration""},{""type"": ""db"",""table"": ""documentation.durationMod""},""describes pain as"",{""type"": ""db"",""table"": ""documentation.quality""},""and"",{""type"": ""db"",""table"": ""documentation.severity""},""with"",{""type"": ""db"",""table"": ""documentation.durationMod""},""pain in the"",{""type"": ""db"",""table"": ""documentation.durationMod""},{""type"": ""db"",""table"": ""hpiLocation""},{""type"": ""db"",""table"": ""durationMod""},{""type"": ""range"",""min"": 0,""max"": 60},{""type"": ""db"",""table"": ""documentation.durationMod""},{""value"": ""relieved with""},{""type"": ""db"",""table"": ""documentation.palliation""},""worsened by"",{""type"": ""db"",""table"": ""documentation.provocation""},""with associated"",{""type"": ""db"",""table"": ""documentation.chiefComplaint""}]}', 'feaa07cc-3ca9-45c0-bd9e-bae00508e5e7'),
	                                   ('copd', 'COPD', '{""defaultTemplateValue"": ""Default"",""templateChunks"": [""complains of"",{""type"": ""db"",""table"": ""documentation.anatomicalModifier""},{""type"": ""db"",""table"": ""documentation.chiefComplaint""},""onset"",{""type"": ""range"",""min"": 0,""max"": 60},{""type"": ""db"",""table"": ""documentation.duration""},{""type"": ""db"",""table"": ""documentation.durationMod""},""describes difficulty breathing as"",{""type"": ""db"",""table"": ""documentation.severity""},""with activity tolerance described as"",{""type"": ""db"",""table"": ""none""},{""type"": ""range"",""min"": 0,""max"": 1000},{""type"": ""db"",""table"": ""none""},{""type"": ""db"",""table"": ""documentation.generalWordModifier""},""use oxygen at"",{""type"": ""db"",""table"": ""documentation.oxygenRate""},""Patient"",{""type"": ""db"",""table"": ""documentation.generalWordModifier""},""use long acting inhalers"",{""type"": ""db"",""table"": ""documentation.generalWordModifier""},""use rescue inhalers relieved with"",{""type"": ""db"",""table"": ""documentation.palliation""},""worsened by"",{""type"": ""db"",""table"": ""documentation.provocation""},""with associated"",{""type"": ""db"",""table"": ""chiefComplaint""}]}', 'feaa07cc-3ca9-45c0-bd9e-bae00508e5e7');");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM Template
                                   WHERE TemplateTypeId = 'feaa07cc-3ca9-45c0-bd9e-bae00508e5e7'");
        }
    }
}
