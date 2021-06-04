using System;
using System.Collections.Generic;
using Medico.Api.DB.Enums;

namespace Medico.Api.DB.Models
{
    public class PatientDemographic : CompanyRelatedEntity
    {
        public BaseVitalSigns BaseVitalSigns { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string MiddleName { get; set; }

        public Gender Gender { get; set; }

        public DateTime DateOfBirth { get; set; }

        public MaritalStatus MaritalStatus { get; set; }

        public string Ssn { get; set; }

        public string PrimaryAddress { get; set; }

        public string SecondaryAddress { get; set; }

        public string City { get; set; }

        public string PrimaryPhone { get; set; }

        public string SecondaryPhone { get; set; }

        public string Email { get; set; }

        public string Zip { get; set; }

        public State State { get; set; }

        public Guid? PatientInsuranceId { get; set; }

        public PatientInsurance PatientInsurance { get; set; }

        public List<Appointment> Appointments { get; set; }

        public List<Admission> Admissions { get; set; }

        public List<MedicalHistory> MedicalHistory { get; set; }

        public List<SurgicalHistory> SurgicalHistory { get; set; }

        public List<FamilyHistory> FamilyHistory { get; set; }

        public List<EducationHistory> EducationHistory { get; set; }

        public List<OccupationalHistory> OccupationalHistory { get; set; }

        public List<Allergy> Allergies { get; set; }

        public List<MedicationHistory> MedicationHistory { get; set; }

        public List<MedicalRecord> MedicalRecords { get; set; }

        public List<TobaccoHistory> TobaccoHistory { get; set; }

        public List<AlcoholHistory> AlcoholHistory { get; set; }

        public List<VitalSigns> VitalSigns { get; set; }

        public List<DrugHistory> DrugHistory { get; set; }
    }
}