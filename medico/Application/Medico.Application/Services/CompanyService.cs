using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels.Company;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class CompanyService : BaseService<Company, CompanyVm>, ICompanyService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPatientChartDocumentNodeService _patientChartDocumentNodeService;
        private readonly ITemplateTypeService _templateTypeService;
        private readonly ITemplateService _templateService;
        private readonly ISelectableListCategoryService _selectableListCategoryService;
        private readonly ISelectableListService _selectableListService;
        private readonly ITemplateSelectableListService _templateSelectableListService;

        public CompanyService(IMapper mapper, ICompanyRepository companyRepository,
            IUnitOfWork unitOfWork,
            IPatientChartDocumentNodeService patientChartDocumentNodeService,
            ITemplateTypeService templateTypeService,
            ITemplateService templateService,
            ISelectableListCategoryService selectableListCategoryService,
            ISelectableListService selectableListService,
            ITemplateSelectableListService templateSelectableListService)
            : base(companyRepository, mapper)
        {
            _unitOfWork = unitOfWork;
            _patientChartDocumentNodeService = patientChartDocumentNodeService;
            _templateTypeService = templateTypeService;
            _templateService = templateService;
            _selectableListCategoryService = selectableListCategoryService;
            _selectableListService = selectableListService;
            _templateSelectableListService = templateSelectableListService;
        }

        public IQueryable<CompanyVm> GetAll()
        {
            return Repository.GetAll()
                .ProjectTo<CompanyVm>();
        }

        public async Task<CompanyVm> CreateNewApplicationCompany(CompanyVm newApplicationCompany)
        {
            // new company
            var newCompanyId = Guid.NewGuid();
            var newCompany = 
                Mapper.Map<Company>(newApplicationCompany);
            newCompany.Id = newCompanyId;

            var templateTypesMap =
                await _templateTypeService.AddToCompanyFromLibrary(newCompanyId);

            var selectableListCategoriesMap = await _selectableListCategoryService
                .AddToCompanyFromLibrary(newCompanyId);

            var selectableListsMap = await _selectableListService
                .AddToCompanyFromLibrary(newCompanyId, selectableListCategoriesMap);

            var templatesMap = await _templateService
                .AddToCompanyFromLibrary(newCompanyId, templateTypesMap, selectableListsMap);
            
            await _templateSelectableListService
                .AddToCompanyFromLibrary(templatesMap, selectableListsMap);

            await _patientChartDocumentNodeService
                .AddToCompanyFromLibrary(newCompanyId, templatesMap, templateTypesMap);

            Repository.Add(newCompany);

            await _unitOfWork.Commit();

            newApplicationCompany.Id = newCompany.Id;
            return newApplicationCompany;
        }

        public Task<List<CompanyVm>> GetByFilter(CompanySearchFilterVm companySearchFilterVm)
        {
            var query = Repository.GetAll();

            var isActive = companySearchFilterVm.IsActive;
            if (isActive != null)
                query = query.Where(c => c.IsActive == isActive.Value);

            var appointmentId = companySearchFilterVm.AppointmentId;
            if (appointmentId.HasValue)
                query = query.Include(c => c.Appointments)
                    .Where(c => c.Appointments.FirstOrDefault(a => a.Id == appointmentId) != null);

            return query.Take(companySearchFilterVm.Take)
                .ProjectTo<CompanyVm>()
                .ToListAsync();
        }
    }
}