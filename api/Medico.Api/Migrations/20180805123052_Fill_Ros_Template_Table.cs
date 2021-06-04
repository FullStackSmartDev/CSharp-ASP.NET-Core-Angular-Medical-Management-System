using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Fill_Ros_Template_Table : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"INSERT INTO Template (Name, Title, Value, TemplateTypeId)
                                    VALUES ('general', 'General', '{""defaultTemplateValue"": ""Denies weight loss, fatigue, weakness, trouble sleeping, fever, or chills."",""templateChunks"": [{""type"": ""db"",""table"": ""documentation.generalWordModifier""},{""type"": ""db"",""table"": ""reviewOfSystems.general""}]}', 'ae28dec4-856f-4a27-87c6-7c76dced86a6'),
                                           ('gi', 'GI', '{""defaultTemplateValue"": ""Denies abdominal pain, nausea, vomiting, change in bowel habits."",""templateChunks"": [{""type"": ""db"",""table"": ""documentation.generalWordModifier""},"":"",{""type"": ""db"",""table"": ""reviewOfSystems.gastrointestinal""}]}', 'ae28dec4-856f-4a27-87c6-7c76dced86a6'),
                                           ('gu', 'GU', '{""defaultTemplateValue"": ""Default"",""templateChunks"": [""Denies dysuria, frequency, discharge, or difficulty voiding.""]}', 'ae28dec4-856f-4a27-87c6-7c76dced86a6'),
                                           ('heent', 'Heent', '{""defaultTemplateValue"": ""Head Denies headache, head injury, dizziness, neck pain, limitation of ROM, lumps or swelling, history of neck surgery Denies vision difficulty, pain, redness, swelling, watering, past history of ocular problems, use of glasses or contact lenses, glaucoma nEars Denies earaches, infections, discharge, hearing loss, tinnitus, vertigo nNose Denies nasal discharge, epitaxis, sinus pain, altered smell Mouth Denies mouth sores, sore throat, bleeding gums, toothache, dysphagia, altered taste nNeck Denies lumps"",""templateChunks"": [{""type"": ""db"",""table"": ""documentation.generalWordModifier""},{""type"": ""db"",""table"": ""documentation.head""},{""type"": ""db"",""table"": ""reviewOfSystems.ears""},{""type"": ""db"",""table"": ""reviewOfSystems.eyes""},{""type"": ""db"",""table"": ""reviewOfSystems.nose""},{""type"": ""db"",""table"": ""reviewOfSystems.throat""}]}', 'ae28dec4-856f-4a27-87c6-7c76dced86a6'),
                                           ('metabolic', 'Metabolic', '{""defaultTemplateValue"": ""Denies Ingestion-Weight Anorexia (Loss of Appetite), Cachexia,Orexigenia (Increased Appetite), Polydipsia (Excessive Thirst), Polyphagia (or Hyperphagia; Overreating), Weight Gain, Weight Loss, Xerostomia (Dry Mouth), Growth Delayed Milestone, Failure to Thrive, Growth Failure, Short Stature"",""templateChunks"": [{""type"": ""db"",""table"": ""documentation.generalWordModifier""},"":"",{""type"": ""db"",""table"": ""reviewOfSystems.metabolism""}]}', 'ae28dec4-856f-4a27-87c6-7c76dced86a6'),
                                           ('muscluoskeletal', 'Muscluoskeletal', '{""defaultTemplateValue"": ""Denies muscle or joint pain swelling, redness, or warmth."",""templateChunks"": [{""type"": ""db"",""table"": ""documentation.generalWordModifier""},"":"",{""type"": ""db"",""table"": ""reviewOfSystems.muscleskeletal""}]}', 'ae28dec4-856f-4a27-87c6-7c76dced86a6'),
                                           ('negative', 'Negative', '{""defaultTemplateValue"": ""Default"",""templateChunks"": [""Otherwise all other systems are negative.""]}', 'ae28dec4-856f-4a27-87c6-7c76dced86a6'),
                                           ('neurological', 'Neurological', '{""defaultTemplateValue"": ""Default"",""templateChunks"": [""Otherwise all other systems are negative.""]}', 'ae28dec4-856f-4a27-87c6-7c76dced86a6'),
                                           ('obgyn', 'Obgyn', '{""defaultTemplateValue"": ""Default"",""templateChunks"": [{""type"": ""db"",""table"": ""documentation.generalWordModifier""},"":"",{""type"": ""db"",""table"": ""reviewOfSystems.obGYN""}]}', 'ae28dec4-856f-4a27-87c6-7c76dced86a6'),
                                           ('pain', 'Pain', '{""defaultTemplateValue"": ""Default"",""templateChunks"": [{""type"": ""db"",""table"": ""documentation.generalWordModifier""},"":"",{""type"": ""db"",""table"": ""reviewOfSystems.pain""}]}', 'ae28dec4-856f-4a27-87c6-7c76dced86a6'),
                                           ('psychiatric', 'Psychiatric', '{""defaultTemplateValue"": ""Denies Audio or Visual Hallucinations or Suicidal Ideations."",""templateChunks"": [{""type"": ""db"",""table"": ""documentation.generalWordModifier""},"":"",{""type"": ""db"",""table"": ""reviewOfSystems.psychiatric""}]}', 'ae28dec4-856f-4a27-87c6-7c76dced86a6'),
                                           ('respiratory', 'Respiratory', '{""defaultTemplateValue"": ""Denies shortness of breath at rest or with activity."",""templateChunks"": [{""type"": ""db"",""table"": ""documentation.generalWordModifier""},"":"",{""type"": ""db"",""table"": ""reviewOfSystems.respiratory""}]}', 'ae28dec4-856f-4a27-87c6-7c76dced86a6'),
                                           ('сardiovascular', 'Cardiovascular', '{""defaultTemplateValue"": ""Denies chest pain, or palpitations, orthopnea, or pedal edema."",""templateChunks"": [{""type"": ""db"",""table"": ""documentation.generalWordModifier""},"":"",{""type"": ""db"",""table"": ""reviewOfSystems.cardiovascular""}]}', 'ae28dec4-856f-4a27-87c6-7c76dced86a6');");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM Template
                                   WHERE TemplateTypeId = 'ae28dec4-856f-4a27-87c6-7c76dced86a6'");
        }
    }
}
