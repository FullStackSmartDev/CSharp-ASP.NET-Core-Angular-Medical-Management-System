using System;
using System.Linq;
using System.Threading.Tasks;
using Medico.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Medico.Identity.Models
{
    public class AspNetUser : IUser
    {
        private readonly IHttpContextAccessor _accessor;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMedicoApplicationUserRepository _medicoApplicationUserRepository;
        private readonly IPatientRepository _patientRepository;
        private readonly IAdmissionRepository _admissionRepository;
        private readonly ILocationRepository _locationRepository;
        private readonly IRoomRepository _roomRepository;
        private readonly IDocumentRepository _documentRepository;

        public AspNetUser(IHttpContextAccessor accessor,
            UserManager<ApplicationUser> userManager,
            IMedicoApplicationUserRepository medicoApplicationUserRepository,
            IPatientRepository patientRepository,
            IAdmissionRepository admissionRepository,
            ILocationRepository locationRepository,
            IRoomRepository roomRepository, 
            IDocumentRepository documentRepository)
        {
            _accessor = accessor;
            _userManager = userManager;
            _medicoApplicationUserRepository = medicoApplicationUserRepository;
            _patientRepository = patientRepository;
            _admissionRepository = admissionRepository;
            _locationRepository = locationRepository;
            _roomRepository = roomRepository;
            _documentRepository = documentRepository;
        }

        public string Name => _accessor.HttpContext.User.Identity.Name;

        public bool IsAuthenticated()
        {
            return _accessor.HttpContext.User.Identity.IsAuthenticated;
        }

        public bool IsInRole(string role)
        {
            return _accessor.HttpContext.User.IsInRole(role);
        }

        public async Task<bool> HasAccessToCompany(Guid companyId)
        {
            var claimsPrincipal = _accessor.HttpContext.User;

            if (claimsPrincipal.IsInRole("SuperAdmin"))
                return true;

            var applicationUser = await _userManager.GetUserAsync(claimsPrincipal);
            var userEmail = applicationUser.Email;

            var medicoApplicationUsers = await _medicoApplicationUserRepository
                .GetAll()
                .AsNoTracking()
                .Where(u => u.Email == userEmail)
                .ToListAsync();

            return medicoApplicationUsers.Any() && medicoApplicationUsers.Any(u => u.CompanyId == companyId);
        }

        public async Task<bool> HasAccessToCompanyPatient(Guid patientId)
        {
            var patient = await _patientRepository.GetAll()
                .FirstOrDefaultAsync(p => p.Id == patientId);

            if (patient == null)
                return false;

            var companyId = patient.CompanyId;
            return await HasAccessToCompany(companyId);
        }

        public async Task<bool> HasAccessToCompanyAdmission(Guid admissionId)
        {
            var admission = await _admissionRepository.GetAll()
                .FirstOrDefaultAsync(a => a.Id == admissionId);

            if (admission == null)
                return false;

            var patientId = admission.PatientId;

            return await HasAccessToCompanyPatient(patientId);
        }

        public async Task<bool> HasAccessToCompanyLocation(Guid locationId)
        {
            var location = await _locationRepository.GetAll()
                .FirstOrDefaultAsync(l => l.Id == locationId);

            if (location == null)
                return false;

            var companyId = location.CompanyId;

            return await HasAccessToCompany(companyId);
        }

        public async Task<bool> HasAccessToCompanyRoom(Guid roomId)
        {
            var room = await _roomRepository.GetAll()
                .FirstOrDefaultAsync(l => l.Id == roomId);

            if (room == null)
                return false;

            var locationId = room.LocationId;

            return await HasAccessToCompanyLocation(locationId);
        }

        public async Task<bool> HasAccessToCompanyEmployee(Guid userId)
        {
            var user = await _medicoApplicationUserRepository.GetAll()
                .FirstOrDefaultAsync(l => l.Id == userId);

            if (user == null)
                return false;

            var companyId = user.CompanyId;

            return await HasAccessToCompany(companyId);
        }

        public async Task<bool> HasAccessToCompanyDocument(Guid documentId)
        {
            var document = await _documentRepository.GetAll()
                .FirstOrDefaultAsync(d => d.Id == documentId);

            if (document == null)
                return false;

            var patientId = document.PatientId;

            return await HasAccessToCompanyPatient(patientId);
        }
    }
}
