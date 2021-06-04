using Microsoft.EntityFrameworkCore.Migrations;

namespace Medico.Api.Migrations
{
    public partial class Recreate_Chief_Complaints : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"DELETE FROM ChiefComplaintRelatedKeyword 
                                   GO
                                   DELETE FROM ChiefComplaintTemplate
                                   GO
                                   DELETE FROM ChiefComplaintKeyword
                                   GO
                                   DELETE FROM ChiefComplaint
                                   GO

                                   INSERT INTO ChiefComplaint (Name, Title)
                                   VALUES ('fever', 'Fever'),
                                          ('weakness', 'Weakness'),
                                          ('dizziness', 'Dizziness'),
                                          ('visualChange', 'Visual Change'),
                                          ('syncope', 'Syncope'),
                                          ('nearSyncope', 'near Syncope'),
                                          ('hypotension', 'Hypotension'),
                                          ('hypertension', 'Hypertension'),
                                          ('earPain', 'Ear Pain'),
                                          ('eyePain', 'Eye Pain'),
                                          ('headache', 'Headache'),
                                          ('migraine', 'Migraine'),
                                          ('nausea', 'Nausea'),
                                          ('vomitting', 'Vomitting'),
                                          ('diarrhea', 'Diarrhea'),
                                          ('difficultySwollowing', 'Difficulty Swollowing'),
                                          ('difficultyBreathing', 'Difficulty Breathing'),
                                          ('shortnessOfBreath', 'Shortness of Breath'),
                                          ('palipitations', 'Palipitations'),
                                          ('wheezing', 'Wheezing'),
                                          ('chestPain', 'Chest Pain'),
                                          ('chestWallPain', 'Chest Wall Pain'),
                                          ('abdominalPain', 'Abdominal Pain'),
                                          ('painfullUrination', 'Painfull Urination'),
                                          ('vaginalDischarge', 'Vaginal Discharge'),
                                          ('vaginalBleeding', 'Vaginal Bleeding'),
                                          ('RectalBleeding', 'Rectal Bleeding'),
                                          ('upperExtremityPain', 'Upper Extremity Pain'),
                                          ('lowerExtremityPain', 'Lower Extremity Pain'),
                                          ('anklePain', 'Ankle Pain'),
                                          ('wristPain', 'Wrist Pain'),
                                          ('handPain', 'Hand Pain'),
                                          ('fingerPain', 'Finger Pain'),
                                          ('kneePain', 'Knee Pain'),
                                          ('backPain', 'Back Pain'),
                                          ('laceration', 'Laceration'),
                                          ('fall', 'Fall'),
                                          ('mva', 'MVA'),
                                          ('woundCheck', 'Wound Check'),
                                          ('sutureRemoval', 'Suture Removal'),
                                          ('diaphoresis', 'Diaphoresis'),
                                          ('genralComplain', 'Genral Complain');");
        }
    }
}
