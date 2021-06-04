using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class UserService : BaseDeletableByIdService<MedicoApplicationUser, MedicoApplicationUserViewModel>, IUserService
    {
        private readonly IMapper _mapper;
        private readonly IMedicoApplicationUserViewRepository _medicoApplicationUserViewRepository;
        private readonly IAppointmentGridItemRepository _appointmentGridItemRepository;
        private readonly IDataSourceLoadOptionsHelper _dataSourceLoadOptionsHelper;

        public UserService(IMedicoApplicationUserViewRepository medicoApplicationUserViewRepository,
            IMapper mapper, IMedicoApplicationUserRepository medicoApplicationUserRepository,
            IAppointmentGridItemRepository appointmentGridItemRepository,
            IDataSourceLoadOptionsHelper dataSourceLoadOptionsHelper) : base(medicoApplicationUserRepository, mapper)
        {
            _medicoApplicationUserViewRepository = medicoApplicationUserViewRepository;
            _mapper = mapper;
            _appointmentGridItemRepository = appointmentGridItemRepository;
            _dataSourceLoadOptionsHelper = dataSourceLoadOptionsHelper;
        }

        public IQueryable<MedicoApplicationUserViewModel> GetAll()
        {
            return _medicoApplicationUserViewRepository.GetAll()
                .ProjectTo<MedicoApplicationUserViewModel>();
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public IQueryable<LookupViewModel> Lookup(UserDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<LookupViewModel>().AsQueryable();

            var startDate = loadOptions.StartDate;
            var endDate = loadOptions.EndDate;

            var searchString = _dataSourceLoadOptionsHelper.GetSearchString(loadOptions);
            var isSearchStringExist = !string.IsNullOrEmpty(searchString);

            //we have to remove native devextreme filter
            if (isSearchStringExist)
                loadOptions.Filter = null;

            var query = _appointmentGridItemRepository.GetAll()
                .Where(a => a.CompanyId == companyId);

            query = ApplyIntervalFilter(startDate, endDate, query, out var isIntervalFilterApplied);

            if (isIntervalFilterApplied)
            {
                if (isSearchStringExist)
                    query = query.Where(a => a.PhysicianFirstName.Contains(searchString) || a.PhysicianLastName.Contains(searchString));

                return query.Select(a => new { a.PhysicianId, a.PhysicianFirstName, a.PhysicianLastName })
                    .Distinct()
                    .Select(p => new LookupViewModel
                    {
                        Id = p.PhysicianId,
                        Name = $"{p.PhysicianFirstName} {p.PhysicianLastName}"
                    });
            }

            var employeeType = loadOptions.EmployeeType;

            var medicoApplicationUserQuery = Repository.GetAll()
                .Where(u => u.EmployeeType == employeeType && u.CompanyId == companyId && u.IsActive);

            if (isSearchStringExist)
                medicoApplicationUserQuery = medicoApplicationUserQuery
                    .Where(u => u.FirstName.Contains(searchString) || u.LastName.Contains(searchString));

            return medicoApplicationUserQuery.ProjectTo<LookupViewModel>();
        }

        public IQueryable<MedicoApplicationUserViewModel> Grid(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<MedicoApplicationUserViewModel>().AsQueryable();

            return _medicoApplicationUserViewRepository.GetAll()
                .Where(u => u.CompanyId == companyId)
                .ProjectTo<MedicoApplicationUserViewModel>();
        }

        public async Task<MedicoApplicationUserViewModel> GetByUserId(Guid id)
        {
            var medicoApplicationUserView = await _medicoApplicationUserViewRepository
                .GetAll().FirstOrDefaultAsync(u => u.Id == id);

            return medicoApplicationUserView == null
                ? null
                : _mapper.Map<MedicoApplicationUserViewModel>(medicoApplicationUserView);
        }

        public async Task<IEnumerable<LookupViewModel>> GetUserCompanies(string email)
        {
            return await Repository.GetAll()
                .Where(u => u.Email == email)
                .Include(u => u.Company)
                .Where(u => u.Company.IsActive)
                .Select(u => u.Company)
                .ProjectTo<LookupViewModel>()
                .ToListAsync();
        }
    }
}