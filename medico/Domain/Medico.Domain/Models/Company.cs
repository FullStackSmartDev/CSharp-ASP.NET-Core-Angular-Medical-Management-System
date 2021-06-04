using System.Collections.Generic;
using Medico.Domain.Enums;

namespace Medico.Domain.Models
{
    public class Company : Entity
    {
        public string Name { get; set; }

        public string Address { get; set; }

        public string SecondaryAddress { get; set; }

        public string City { get; set; }

        public int State { get; set; }

        public string ZipCode { get; set; }

        public ZipCodeType ZipCodeType { get; set; }

        public string Phone { get; set; }

        public string Fax { get; set; }

        public string WebSiteUrl { get; set; }

        public bool IsActive { get; set; }

        public List<Location> Locations { get; set; }

        public List<SelectableListCategory> SelectableListCategories { get; set; }

        public List<MedicoApplicationUser> MedicoApplicationUsers { get; set; }

        public List<SelectableList> SelectableLists { get; set; }

        public List<TemplateType> TemplateTypes { get; set; }

        public List<Patient> Patients { get; set; }

        public List<Appointment> Appointments { get; set; }

        public List<Phrase> Phrases { get; set; }

        public List<Template> Templates { get; set; }

        public List<PatientChartDocumentNode> PatientChartNodeDocuments { get; set; }
        
        public List<ReferenceTable> ReferenceTables { get; set; }
        
        public List<Expression> Expressions { get; set; }
    }
}