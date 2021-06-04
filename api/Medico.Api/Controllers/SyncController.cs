using System;
using System.Linq;
using System.Text;
using Medico.Api.DB;
using Medico.Api.DB.Models;
using Medico.Api.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Medico.Api.Controllers
{
    [Route("api/sync")]
    public class SyncController : Controller
    {
        private readonly MedicoContext _medicoContext;


        public SyncController(MedicoContext medicoContext)
        {
            _medicoContext = medicoContext;
        }

        [Route("push")]
        [HttpPost]
        public bool Push([FromBody]PushViewModel pushViewModel)
        {
            if(pushViewModel == null)
                throw new ArgumentNullException();
            if(pushViewModel.PushScript == null)
                throw new InvalidOperationException();

            var commands = pushViewModel.PushScript.Split(";");
            _medicoContext.Database.ExecuteSqlCommand(commands[0]);
            _medicoContext.Database.ExecuteSqlCommand(commands[1]);
            return true;
        }

        [Route("pull")]
        [HttpPost]
        public IActionResult Pull([FromBody]string tableName)
        {
            if (string.IsNullOrEmpty(tableName))
                throw new ArgumentException(nameof(tableName));

            var pullRequestResult = CreatePullResult(tableName);

            return Ok(pullRequestResult);
        }

        private PullResultViewModel CreatePullResult(string tableName)
        {
            PullResultViewModel pullResult;
            switch (tableName)
            {
                case "Company":
                    pullResult = CreateCompanyPullResult();
                    break;
                case "SelectableTemplateItem":
                    pullResult = CreateSelectableTemplateItemPullResult();
                    break;
                case "PatientDemographic":
                    pullResult = CreatePatientDemographicPullResult();
                    break;
                case "Employee":
                    pullResult = CreateEmployeePullResult();
                    break;
                case "Location":
                    pullResult = CreateLocationPullResult();
                    break;
                case "Room":
                    pullResult = CreateRoomPullResult();
                    break;
                case "Appointment":
                    pullResult = CreateAppointmentPullResult();
                    break;
                case "Admission":
                    pullResult = CreateAdmissionPullResult();
                    break;
                default:
                    throw new InvalidOperationException("The table is not exist");
            }
            return pullResult;
        }

        private PullResultViewModel CreateAdmissionPullResult()
        {
            var pullResult = new PullResultViewModel();

            var createTableScript = GetAdmissionTableScript();
            var insertValuesTableScript = GetAdmissionInsertValuesScript();

            pullResult.CreateTableScript = createTableScript;
            pullResult.InsertValuesScript = insertValuesTableScript;

            return pullResult;
        }

        private string GetAdmissionInsertValuesScript()
        {
            var insertValuesScript = new StringBuilder();
            insertValuesScript.Append(@"INSERT INTO Admission(Id, PatientDemographicId, AppointmentId, AdmissionData, CreatedDate) VALUES ");

            var admissions = _medicoContext.Set<Admission>().ToArray();
            if (admissions.Length == 0)
            {
                return string.Empty;
            }
            foreach (var admission in admissions)
            {
                var id = admission.Id;
                var patientDemographicId = admission.PatientDemographicId;
                var admissionData = admission.AdmissionData;
                var createdDate = admission.CreatedDate;

                insertValuesScript.Append(" ( ");
                insertValuesScript.Append($"'{id}', ");
                insertValuesScript.Append($"'{patientDemographicId}', ");
                insertValuesScript.Append($"'{admissionData}', ");
                insertValuesScript.Append($"'{createdDate}')");
            }

            return insertValuesScript.ToString();
        }

        private string GetAdmissionTableScript()
        {
            return @"CREATE TABLE IF NOT EXISTS Admission(
                        Id uniqueidentifier NOT NULL,
                        PatientDemographicId uniqueidentifier NOT NULL,
                        AppointmentId uniqueidentifier NOT NULL,
                        AdmissionData nvarchar NOT NULL,
                        CreatedDate date NOT NULL)";
        }

        private PullResultViewModel CreateAppointmentPullResult()
        {
            var pullResult = new PullResultViewModel();

            var createTableScript = GetAppointmentTableScript();
            var insertValuesTableScript = GetAppointmentInsertValuesScript();

            pullResult.CreateTableScript = createTableScript;
            pullResult.InsertValuesScript = insertValuesTableScript;

            return pullResult;
        }

        private string GetAppointmentInsertValuesScript()
        {
            var insertValuesScript = new StringBuilder();
            insertValuesScript.Append(@"INSERT INTO Appointment(Id, CompanyId, PatientDemographicId,
                                                    PhysicianId, NurseId, RoomId, StartDate, EndDate,
                                                    AppointmentStatus, AdmissionId)
                                               VALUES ");
            var appointments = _medicoContext.Set<Appointment>().ToArray();
            if (appointments.Length == 0)
            {
                return string.Empty;
            }
            foreach (var appointment in appointments)
            {
                var id = appointment.Id;
                var companyId = appointment.CompanyId;
                var patientDemographicId = appointment.PatientDemographicId;
                var physicianId = appointment.PhysicianId;
                var nurseId = appointment.NurseId;
                var roomId = appointment.RoomId;
                var startDate = appointment.StartDate;
                var endDate = appointment.EndDate;
                var appointmentStatus = appointment.AppointmentStatus;
                var admissionId = appointment.AdmissionId;

                insertValuesScript.Append(" ( ");
                insertValuesScript.Append($"'{id}', ");
                insertValuesScript.Append($"'{companyId}', ");
                insertValuesScript.Append($"'{patientDemographicId}', ");
                insertValuesScript.Append($"'{physicianId}', ");
                insertValuesScript.Append($"'{nurseId}', ");
                insertValuesScript.Append($"'{roomId}', ");
                insertValuesScript.Append($"'{startDate}', ");
                insertValuesScript.Append($"'{endDate}', ");
                insertValuesScript.Append($" {appointmentStatus} , ");
                insertValuesScript.Append($"'{admissionId}')");
            }

            return insertValuesScript.ToString();
        }

        private string GetAppointmentTableScript()
        {
            return @"CREATE TABLE IF NOT EXISTS Appointment(
                        Id uniqueidentifier NOT NULL,
                        CompanyId uniqueidentifier NOT NULL,
                        PatientDemographicId uniqueidentifier NOT NULL,
                        PhysicianId uniqueidentifier NOT NULL,
                        NurseId uniqueidentifier NOT NULL,
                        RoomId uniqueidentifier NOT NULL,
                        StartDate date NOT NULL,
                        EndDate date NOT NULL,
                        AppointmentStatus int NOT NULL,
                        AdmissionId uniqueidentifier NOT NULL)";
        }

        private PullResultViewModel CreateRoomPullResult()
        {
            var pullResult = new PullResultViewModel();

            var createTableScript = GetRoomTableScript();
            var insertValuesTableScript = GetRoomInsertValuesScript();

            pullResult.CreateTableScript = createTableScript;
            pullResult.InsertValuesScript = insertValuesTableScript;

            return pullResult;
        }

        private string GetRoomInsertValuesScript()
        {
            var insertValuesScript = new StringBuilder();
            insertValuesScript.Append(@" INSERT INTO Room(Id, LocationId, Name)
                        VALUES ");
            var rooms = _medicoContext.Set<Room>().ToArray();
            if (rooms.Length == 0)
            {
                return string.Empty;
            }
            foreach (var room in rooms)
            {
                var id = room.Id;
                var locationId = room.LocationId;
                var name = room.Name;

                insertValuesScript.Append(" ( ");
                insertValuesScript.Append($"'{id}', ");
                insertValuesScript.Append($"'{locationId}', ");
                insertValuesScript.Append($"'{name}')");
            }

            return insertValuesScript.ToString();
        }

        private string GetRoomTableScript()
        {
            return @"CREATE TABLE IF NOT EXISTS Room( Id uniqueidentifier NOT NULL, LocationId uniqueidentifier NOT NULL, Name nvarchar NULL )";
        }

        private PullResultViewModel CreateLocationPullResult()
        {
            var pullResult = new PullResultViewModel();

            var createTableScript = GetLocationTableScript();
            var insertValuesTableScript = GetLocationInsertValuesScript();

            pullResult.CreateTableScript = createTableScript;
            pullResult.InsertValuesScript = insertValuesTableScript;

            return pullResult;
        }

        private string GetLocationInsertValuesScript()
        {
            var insertValuesScript = new StringBuilder();
            insertValuesScript.Append(@" INSERT INTO Location(Id, CompanyId, Name, Address, City, State, Zip, Fax, Phone, SecondaryAddress)
                        VALUES ");
            var locations = _medicoContext.Set<Location>().ToArray();
            if (locations.Length == 0)
            {
                return string.Empty;
            }
            foreach (var location in locations)
            {
                var id = location.Id;
                var companyId = location.CompanyId;
                var name = location.Name;
                var address = location.Address;
                var city = location.City;
                var state = location.State;
                var zip = location.Zip;
                var fax = location.Fax;
                var phone = location.Phone;
                var secondaryAddress = location.SecondaryAddress;

                insertValuesScript.Append(" ( ");
                insertValuesScript.Append($"'{id}', ");
                insertValuesScript.Append($"'{companyId}', ");
                insertValuesScript.Append($"'{name}', ");
                insertValuesScript.Append($"'{address}', ");
                insertValuesScript.Append($"'{city}', ");
                insertValuesScript.Append($"'{state}', ");
                insertValuesScript.Append($"'{zip}', ");
                insertValuesScript.Append($"'{city}', ");
                insertValuesScript.Append($"'{zip}', ");
                insertValuesScript.Append($"'{fax}', ");
                insertValuesScript.Append($"'{phone}', ");
                insertValuesScript.Append($"'{secondaryAddress}')");
            }

            return insertValuesScript.ToString();
        }

        private string GetLocationTableScript()
        {
            return @"CREATE TABLE IF NOT EXISTS Location(
                            Id uniqueidentifier NOT NULL,
                            CompanyId uniqueidentifier NOT NULL,
                            Name nvarchar(100) NOT NULL,
                            Address nvarchar(200) NOT NULL,
                            City nvarchar(100) NOT NULL,
                            State nvarchar(100) NOT NULL,
                            Zip nvarchar(100) NOT NULL,
                            Fax nvarchar(100) NOT NULL,
                            Phone nvarchar(100) NOT NULL,
                            SecondaryAddress nvarchar(200) NULL)";
        }

        private PullResultViewModel CreateEmployeePullResult()
        {
            var pullResult = new PullResultViewModel();

            var createTableScript = GetEmployeeTableScript();
            var insertValuesTableScript = GetEmployeeInsertValuesScript();

            pullResult.CreateTableScript = createTableScript;
            pullResult.InsertValuesScript = insertValuesTableScript;

            return pullResult;
        }

        private string GetEmployeeInsertValuesScript()
        {
            var insertValuesScript = new StringBuilder();
            insertValuesScript.Append(@"
                        INSERT INTO Employee(Id, CompanyId, FirstName, MiddleName,
                                    LastName, Address, SecondaryAddress, City, Zip,
                                    PrimaryPhone, SecondaryPhone, ExmployeeType, Ssn, Gender, DateOfBirth)
                        VALUES ");
            var employees = _medicoContext.Set<Employee>().ToArray();
            if (employees.Length == 0)
            {
                return string.Empty;
            }
            foreach (var employee in employees)
            {
                var id = employee.Id;
                var companyId = employee.CompanyId;
                var firstName = employee.FirstName;
                var middleName = employee.MiddleName;
                var lastName = employee.LastName;
                var address = employee.Address;
                var secondaryAddress = employee.SecondaryAddress;
                var city = employee.City;
                var zip = employee.Zip;
                var primaryPhone = employee.PrimaryPhone;
                var secondaryPhone = employee.SecondaryPhone;
                var employeeType = (int)employee.EmployeeType;
                var ssn = employee.Ssn;
                var gender = (int)employee.Gender;
                var dob = employee.DateOfBirth;

                insertValuesScript.Append(" ( ");
                insertValuesScript.Append($"'{id}', ");
                insertValuesScript.Append($"'{companyId}', ");
                insertValuesScript.Append($"'{firstName}', ");
                insertValuesScript.Append($"'{middleName}', ");
                insertValuesScript.Append($"'{lastName}', ");
                insertValuesScript.Append($"'{address}', ");
                insertValuesScript.Append($"'{secondaryAddress}', ");
                insertValuesScript.Append($"'{city}', ");
                insertValuesScript.Append($"'{zip}', ");
                insertValuesScript.Append($"'{primaryPhone}', ");
                insertValuesScript.Append($"'{secondaryPhone}', ");
                insertValuesScript.Append($" {employeeType}, ");
                insertValuesScript.Append($" '{ssn}', ");
                insertValuesScript.Append($" {gender}, ");
                insertValuesScript.Append($"'{dob}')");
            }

            return insertValuesScript.ToString();
        }

        private string GetEmployeeTableScript()
        {
            return @"CREATE TABLE IF NOT EXISTS Employee(
                            Id uniqueidentifier NOT NULL,
                            CompanyId uniqueidentifier NOT NULL,
                            FirstName nvarchar(100) NOT NULL,
                            MiddleName nvarchar(100) NULL,
                            LastName nvarchar(100) NOT NULL,
                            Address nvarchar(200) NOT NULL,
                            SecondaryAddress nvarchar(200) NULL,
                            City nvarchar(100) NOT NULL,
                            Zip nvarchar(100) NOT NULL,
                            PrimaryPhone nvarchar(100) NOT NULL,
                            SecondaryPhone nvarchar(100) NULL,
                            ExmployeeType int NOT NULL,
                            Ssn nvarchar(100) NOT NULL,
                            Gender int NOT NULL,
                            DateOfBirth date NOT NULL)";
        }

        private PullResultViewModel CreatePatientDemographicPullResult()
        {
            var pullResult = new PullResultViewModel();

            var createTableScript = GetPatientDemographicTableScript();
            var insertValuesTableScript = GetPatientDemographicInsertValuesScript();

            pullResult.CreateTableScript = createTableScript;
            pullResult.InsertValuesScript = insertValuesTableScript;

            return pullResult;
        }

        private string GetPatientDemographicInsertValuesScript()
        {
            var insertValuesScript = new StringBuilder();
            insertValuesScript.Append(@"
                        INSERT INTO PatientDemographic (Id, CompanyId, FirstName, LastName, Gender, DateOfBirth)
                        VALUES ");
            var patients = _medicoContext.Set<PatientDemographic>().ToArray();
            if (patients.Length == 0)
            {
                return string.Empty;
            }
            for (var i = 0; i < patients.Length; i++)
            {
                var patient = patients[i];
                var id = patient.Id;
                var companyId = patient.CompanyId;
                var firstName = patient.FirstName;
                var lastName = patient.LastName;
                var gender = (int)patient.Gender;
                var dob = patient.DateOfBirth;

                insertValuesScript.Append(" ( ");
                insertValuesScript.Append($"'{id}', ");
                insertValuesScript.Append($"'{companyId}', ");
                insertValuesScript.Append($"'{firstName}', ");
                insertValuesScript.Append($"'{lastName}', ");
                insertValuesScript.Append($" {gender}, ");
                insertValuesScript.Append($"'{dob}')");

                if (i != patients.Length - 1)
                {
                    insertValuesScript.Append(",");
                }
            }

            return insertValuesScript.ToString();
        }

        private string GetPatientDemographicTableScript()
        {
            return @"CREATE TABLE IF NOT EXISTS PatientDemographic (
	                Id uniqueidentifier NOT NULL,
	                CompanyId uniqueidentifier NOT NULL,
	                FirstName nvarchar(100) NOT NULL,
	                LastName  nvarchar(100) NOT NULL,
	                Gender int NOT NULL,
	                DateOfBirth date NOT NULL)";
        }

        private string GetLookupItemCreateTableScript()
        {
            return @"CREATE TABLE IF NOT EXISTS LookupItem 
                    (
                        Name nvarchar primary key,
                        LookupValues nvarchar
                    )";
        }


        private PullResultViewModel CreateSelectableTemplateItemPullResult()
        {
            var pullResult = new PullResultViewModel();

            var createTableScript = GetSelectableTemplateItemCreateTableScript();
            var insertValuesTableScript = GetSelectableTemplateItemInsertValuesScript();

            pullResult.CreateTableScript = createTableScript;
            pullResult.InsertValuesScript = insertValuesTableScript;
            return pullResult;
        }

        private string GetSelectableTemplateItemInsertValuesScript()
        {
            var insertValuesScript = new StringBuilder();
            insertValuesScript.Append(@"
                        INSERT INTO SelectableTemplateItem (Name, JsonValues)
                        VALUES ");
            var selectableTemplateItems = _medicoContext.Set<TemplateLookupItem>().ToArray();
            for (var i = 0; i < selectableTemplateItems.Length; i++)
            {
                var selectableTemplateItem = selectableTemplateItems[i];
                var name = selectableTemplateItem.Name;
                var jsonValues = selectableTemplateItem.JsonValues;

                insertValuesScript.Append(" ( ");
                insertValuesScript.Append($"'{name}', ");
                insertValuesScript.Append($"'{jsonValues}')");

                if (i != selectableTemplateItems.Length - 1)
                {
                    insertValuesScript.Append(",");
                }
            }

            return insertValuesScript.ToString();
        }

        private static string GetSelectableTemplateItemCreateTableScript()
        {
            return @"CREATE TABLE IF NOT EXISTS SelectableTemplateItem 
                    (
                        Name nvarchar primary key,
                        JsonValues nvarchar
                    )";
        }

        private PullResultViewModel CreateCompanyPullResult()
        {
            var pullResult = new PullResultViewModel();

            var createCompanyTableScript = GetCompanyCreateTableScript();
            var insertValuesCompanyTableScript = GetCompanyInsertValuesScript();

            pullResult.CreateTableScript = createCompanyTableScript;
            pullResult.InsertValuesScript = insertValuesCompanyTableScript;
            return pullResult;
        }

        private string GetCompanyInsertValuesScript()
        {
            var insertValuesScript = new StringBuilder();
            insertValuesScript.Append(@"
                        INSERT INTO Company (Id, Address, City, Fax, Name, Phone, SecondaryAddress, State, ZipCode)
                        VALUES ");
            var companies = _medicoContext.Set<Company>().ToArray();
            for (var i = 0; i < companies.Length; i++)
            {
                var company = companies[0];

                var id = company.Id;
                var name = company.Name;
                var address = company.Address;
                var secondaryAddress = company.SecondaryAddress;
                var city = company.City;
                var fax = company.Fax;
                var state = company.State;
                var phone = company.Phone;
                var zipCode = company.ZipCode;

                insertValuesScript.Append(" ( ");
                insertValuesScript.Append($"'{id}', ");
                insertValuesScript.Append($"'{address}', ");
                insertValuesScript.Append($"'{city}', ");
                insertValuesScript.Append($"'{fax}', ");
                insertValuesScript.Append($"'{name}', ");
                insertValuesScript.Append($"'{phone}', ");
                insertValuesScript.Append($"'{secondaryAddress}', ");
                insertValuesScript.Append($"'{state}', ");
                insertValuesScript.Append($"'{zipCode}')");

                if (i != companies.Length - 1)
                {
                    insertValuesScript.Append(",");
                }
            }

            return insertValuesScript.ToString();
        }

        private static string GetCompanyCreateTableScript()
        {
            return @"CREATE TABLE IF NOT EXISTS Company 
                    (
                        Id uniqueidentifier,
                        Address nvarchar,
                        City nvarchar,
                        Fax nvarchar,
                        Name nvarchar,
                        Phone nvarchar,
                        SecondaryAddress nvarchar,
                        State nvarchar,
                        ZipCode nvarchar
                    )";
        }
    }

    public class PushViewModel
    {
        public string PushScript { get; set; }
    }
}
