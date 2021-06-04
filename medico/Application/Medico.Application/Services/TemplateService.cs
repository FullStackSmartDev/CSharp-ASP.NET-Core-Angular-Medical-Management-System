using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.ExpressionItemsManagement;
using Medico.Application.Interfaces;
using Medico.Application.SelectableItemsManagement;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Template;
using Medico.Data.Repository;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class TemplateService : BaseDeletableByIdService<Template, TemplateVm>, ITemplateService
    {
        private readonly IChiefComplaintTemplateRepository _chiefComplaintTemplateRepository;
        private readonly ITemplateRepository _templateRepository;
        private readonly ITemplateSelectableListRepository _templateSelectableListRepository;
        private readonly ISelectableListService _selectableListService;
        private readonly ISelectableItemsService _selectableItemsService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITemplateTypeService _templateTypeService;
        private readonly IExpressionItemsService _expressionItemsService;
        private readonly ITemplateExpressionRepository _templateExpressionRepository;
        private readonly IExpressionService _expressionService;

        public TemplateService(ITemplateRepository templateRepository,
            IMapper mapper,
            IChiefComplaintTemplateRepository chiefComplaintTemplateRepository,
            ISelectableItemsService selectableItemsService,
            IUnitOfWork unitOfWork,
            ITemplateSelectableListRepository templateSelectableListRepository,
            ISelectableListService selectableListService,
            ITemplateTypeService templateTypeService,
            IExpressionItemsService expressionItemsService,
            ITemplateExpressionRepository templateExpressionRepository,
            IExpressionService expressionService)
            : base(templateRepository, mapper)
        {
            _templateRepository = templateRepository;
            _chiefComplaintTemplateRepository = chiefComplaintTemplateRepository;
            _selectableItemsService = selectableItemsService;
            _unitOfWork = unitOfWork;
            _templateSelectableListRepository = templateSelectableListRepository;
            _selectableListService = selectableListService;
            _templateTypeService = templateTypeService;
            _expressionItemsService = expressionItemsService;
            _templateExpressionRepository = templateExpressionRepository;
            _expressionService = expressionService;
        }

        public override async Task<TemplateVm> Create(TemplateVm viewModel)
        {
            var isLibraryTemplate = viewModel.CompanyId == null;

            if (isLibraryTemplate)
                viewModel.Version = 1;

            var detailedTemplateContent = viewModel.DetailedTemplateHtml;
            var template = Mapper.Map<Template>(viewModel);
            _templateRepository.Add(template);

            if (!string.IsNullOrWhiteSpace(detailedTemplateContent))
            {
                await UpdateTemplateSelectableListsReferences(detailedTemplateContent, template);
                await UpdateTemplateExpressionReferences(detailedTemplateContent, template);
            }

            await _unitOfWork.Commit();

            return viewModel;
        }

        public override async Task<TemplateVm> Update(TemplateVm viewModel)
        {
            var isLibraryTemplate = viewModel.CompanyId == null;
            if (isLibraryTemplate)
                viewModel.Version += 1;

            var detailedTemplateContent = viewModel.DetailedTemplateHtml;

            var template = Mapper.Map<Template>(viewModel);
            _templateRepository.Update(template);

            if (!string.IsNullOrWhiteSpace(detailedTemplateContent))
            {
                await UpdateTemplateSelectableListsReferences(detailedTemplateContent, template);
                await UpdateTemplateExpressionReferences(detailedTemplateContent, template);
            }

            await _unitOfWork.Commit();

            return viewModel;
        }

        private async Task UpdateTemplateExpressionReferences(string detailedTemplateContent, Template template)
        {
            var expressionIds = _expressionItemsService
                .GetExpressionIdsFromHtmlContent(detailedTemplateContent);

            if (template.Id != Guid.Empty)
            {
                await _templateExpressionRepository.GetAll()
                    .Where(te => te.TemplateId == template.Id)
                    .ForEachAsync(te => _templateExpressionRepository.Remove(te));
            }

            foreach (var expressionId in expressionIds)
            {
                _templateExpressionRepository.Add(new TemplateExpression
                {
                    Template = template,
                    ExpressionId = expressionId
                });
            }
        }

        private async Task UpdateTemplateSelectableListsReferences(string detailedTemplateContent, Template template)
        {
            var selectableListIds = _selectableItemsService
                .GetSelectableListIdsFromHtmlContent(detailedTemplateContent);

            if (template.Id != Guid.Empty)
            {
                await _templateSelectableListRepository.GetAll()
                    .Where(tss => tss.TemplateId == template.Id)
                    .ForEachAsync(tts => _templateSelectableListRepository.Remove(tts));
            }

            foreach (var selectableListId in selectableListIds)
            {
                _templateSelectableListRepository.Add(new TemplateSelectableList
                {
                    Template = template,
                    SelectableListId = selectableListId
                });
            }
        }

        public async Task ActivateTemplate(Guid templateId)
        {
            var template =
                await Repository.GetAll()
                    .FirstOrDefaultAsync(t => t.Id == templateId);

            var templateMaxOrder = await Repository
                .GetAll()
                .Where(t => t.TemplateTypeId == template.TemplateTypeId)
                .MaxAsync(t => t.TemplateOrder);

            template.TemplateOrder = templateMaxOrder == null
                ? 1
                : templateMaxOrder + 1;
            template.IsActive = true;

            await Repository.SaveChangesAsync();
        }

        public async Task DeactivateTemplate(Guid templateId)
        {
            var template =
                await Repository.GetAll()
                    .FirstOrDefaultAsync(t => t.Id == templateId);

            var templateOrder = template.TemplateOrder;
            if (!templateOrder.HasValue)
                throw new InvalidOperationException("Active template has to have an order");

            await AdjustTemplatesOrders(templateOrder.Value, template.TemplateTypeId);

            template.TemplateOrder = null;
            template.IsActive = false;

            await Repository.SaveChangesAsync();
        }

        public override async Task<TemplateVm> GetById(Guid id)
        {
            var template = await Repository.GetAll()
                .FirstOrDefaultAsync(t => t.Id == id);

            var templateVm = Mapper.Map<TemplateVm>(template);

            var detailedTemplateContent =
                templateVm.DetailedTemplateHtml;

            if (!string.IsNullOrEmpty(detailedTemplateContent))
            {
                templateVm.InitialDetailedTemplateHtml = _selectableItemsService
                    .SetInitialValues(detailedTemplateContent);
            }

            return templateVm;
        }

        public IQueryable<TemplateVm> GetAll()
        {
            return Repository.GetAll()
                .ProjectTo<TemplateVm>();
        }

        public async Task Delete(Guid id)
        {
            var template = await Repository
                .GetAll()
                .Include(t => t.ChiefComplaintTemplates)
                .Include(t => t.TemplateSelectableLists)
                .Include(t => t.LibraryRelatedTemplates)
                .Include(t => t.TemplateExpressions)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (template == null)
                return;

            if (template.IsActive)
            {
                var templateOrder = template.TemplateOrder;
                if (!templateOrder.HasValue)
                    throw new InvalidOperationException("Active template has to be an order");

                await AdjustTemplatesOrders(templateOrder.Value, template.TemplateTypeId);
            }

            //remove all chief complaint template references
            var chiefComplaintTemplates = template.ChiefComplaintTemplates;
            if (chiefComplaintTemplates.Any())
                chiefComplaintTemplates
                    .ForEach(ct => _chiefComplaintTemplateRepository.Remove(ct));

            //remove all selectable lists references
            var templateSelectableLists = template.TemplateSelectableLists;
            if (templateSelectableLists.Any())
                templateSelectableLists.ForEach(r => _templateSelectableListRepository.Remove(r));

            //remove all expressions references
            var templateExpressions = template.TemplateExpressions;
            if (templateExpressions.Any())
                templateExpressions.ForEach(r => _templateExpressionRepository.Remove(r));

            var libraryRelatedTemplates = await _templateRepository.GetAll()
                .Where(t => t.LibraryTemplateId != null && t.LibraryTemplateId == id)
                .ToListAsync();

            if (libraryRelatedTemplates.Any())
                libraryRelatedTemplates.ForEach(t =>
                {
                    t.LibraryTemplateId = null;
                    t.Version = null;
                });

            ((Repository<Template>) _templateRepository).Remove(template);

            await _unitOfWork.Commit();
        }

        public async Task<IEnumerable<TemplateWithTypeNameViewModel>> GetRequired(Guid companyId)
        {
            if (companyId == Guid.Empty)
                return Enumerable.Empty<TemplateWithTypeNameViewModel>();

            var templates = await Repository.GetAll()
                .Include(t => t.TemplateType)
                .Where(t => t.IsRequired)
                .Where(t => t.CompanyId == companyId)
                .ProjectTo<TemplateWithTypeNameViewModel>()
                .ToListAsync();

            return templates;
        }

        public async Task<IEnumerable<TemplateVm>> GetChiefComplaintTemplates(Guid chiefComplaintId)
        {
            var templates = await _chiefComplaintTemplateRepository.GetAll()
                .Where(ct => ct.ChiefComplaintId == chiefComplaintId)
                .Include(ct => ct.Template)
                .Select(ct => ct.Template)
                .ProjectTo<TemplateVm>()
                .ToListAsync();

            return templates;
        }

        public IQueryable<TemplateGridItemVm> Grid(TemplateDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<TemplateGridItemVm>()
                    .AsQueryable();

            var templateTypeId = loadOptions.TemplateTypeId;
            if (templateTypeId == Guid.Empty)
                return Enumerable.Empty<TemplateGridItemVm>()
                    .AsQueryable();

            return Repository.GetAll()
                .Where(t => t.CompanyId == companyId && t.TemplateTypeId == templateTypeId)
                .ProjectTo<TemplateGridItemVm>();
        }

        public IQueryable<LookupViewModel> Lookup(TemplateDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<LookupViewModel>()
                    .AsQueryable();

            var templateTypeId = loadOptions.TemplateTypeId;
            if (templateTypeId == Guid.Empty)
                return Repository.GetAll().Where(t => t.IsActive && t.CompanyId == companyId)
                    .ProjectTo<LookupViewModel>();

            return Repository.GetAll()
                .Where(t => t.IsActive && t.TemplateTypeId == templateTypeId && t.CompanyId == companyId)
                .ProjectTo<LookupViewModel>();
        }

        public IQueryable<TemplateGridItemVm> LibraryGrid(TemplateDxOptionsViewModel loadOptions)
        {
            var templateTypeId = loadOptions.TemplateTypeId;
            if (templateTypeId == Guid.Empty)
                return Enumerable.Empty<TemplateGridItemVm>()
                    .AsQueryable();

            return Repository.GetAll()
                .Where(t => t.CompanyId == null && t.TemplateTypeId == templateTypeId)
                .ProjectTo<TemplateGridItemVm>();
        }

        public async Task ReorderTemplates(TemplatesOrdersVm templatesOrders)
        {
            var templateIdsToReorder = templatesOrders
                .TemplatesOrders
                .Select(t => t.Id);

            var templatesToReorder = await Repository.GetAll()
                .Where(t => templateIdsToReorder.Contains(t.Id))
                .ToListAsync();

            foreach (var template in templatesToReorder)
            {
                template.TemplateOrder = templatesOrders
                    .TemplatesOrders.First(t => t.Id == template.Id).Order;
            }

            await Repository.SaveChangesAsync();
        }

        public Task<List<TemplateGridItemVm>> GetByFilter(TemplateSearchFilterVm templateSearchFilter)
        {
            var query = Repository.GetAll();

            var isRequired = templateSearchFilter.IsRequired;
            if (isRequired.HasValue)
                query = query.Where(t => t.IsRequired == isRequired.Value);

            var excludeImported = templateSearchFilter.ExcludeImported;
            if (excludeImported.HasValue)
                return GetLibraryTemplatesNotImportedToCompany(templateSearchFilter.TemplateTypeId,
                    templateSearchFilter.CompanyId);

            var templateTypeId = templateSearchFilter.TemplateTypeId;
            if (templateTypeId != null)
                query = query.Where(t => t.TemplateTypeId == templateTypeId);

            var isActiveFilter = templateSearchFilter.IsActive;
            if (isActiveFilter != null)
                query = query.Where(t => t.IsActive == isActiveFilter.Value);

            query = query.Where(t => t.CompanyId == templateSearchFilter.CompanyId);

            var selectableListId = templateSearchFilter.SelectableListId;
            if (selectableListId.HasValue)
            {
                query = query
                    .Include(t =>
                        t.TemplateSelectableLists)
                    .Where(t =>
                        t.TemplateSelectableLists.FirstOrDefault(tl => tl.SelectableListId == selectableListId) !=
                        null);
            }

            var expressionId = templateSearchFilter.ExpressionId;
            if (expressionId.HasValue)
            {
                query = query
                    .Include(t =>
                        t.TemplateExpressions)
                    .Where(t =>
                        t.TemplateExpressions.FirstOrDefault(te => te.ExpressionId == expressionId) != null);
            }

            var chiefComplaintId = templateSearchFilter.ChiefComplaintId;
            if (chiefComplaintId.HasValue)
            {
                query = query.Include(t => t.ChiefComplaintTemplates)
                    .Where(t => t.ChiefComplaintTemplates.FirstOrDefault(temp =>
                        temp.ChiefComplaintId == chiefComplaintId.Value) != null);
            }

            var takeCount = templateSearchFilter.Take;
            if (takeCount != 0)
                query = query.Take(takeCount);

            query = query.Include(t => t.TemplateType)
                .Include(t => t.LibraryTemplate)
                .Select(t => t);

            return query.ProjectTo<TemplateGridItemVm>()
                .ToListAsync();
        }

        private async Task<List<TemplateGridItemVm>> GetLibraryTemplatesNotImportedToCompany(Guid? templateTypeId,
            Guid? companyId)
        {
            if (templateTypeId == null || companyId == null)
                throw new ArgumentNullException();

            var libraryTemplateQuery =
                Repository.GetAll()
                    .Where(t => t.TemplateTypeId == templateTypeId)
                    .ProjectTo<TemplateGridItemVm>();

            var companyImportedTemplateIdsQuery = Repository.GetAll()
                .Where(t => t.CompanyId == companyId && t.LibraryTemplateId.HasValue)
                .Select(t => t.LibraryTemplateId.Value);

            var templateMaps = await libraryTemplateQuery
                .GroupJoin(companyImportedTemplateIdsQuery,
                    libraryTemplate => libraryTemplate.Id,
                    companyImportedTemplateId => companyImportedTemplateId,
                    (libraryTemplate, companyImportedTemplateId) => new
                        {libraryTemplate, companyImportedTemplateId})
                .SelectMany(
                    map => map.companyImportedTemplateId.DefaultIfEmpty(),
                    (map, companyImportedTemplateId) => new {map.libraryTemplate, companyImportedTemplateId})
                .ToListAsync();

            return templateMaps.Where(map => map.companyImportedTemplateId == Guid.Empty)
                .Select(x => x.libraryTemplate)
                .ToList();
        }

        public async Task<IDictionary<Guid, Guid>> AddToCompanyFromLibrary(Guid newCompanyId,
            IDictionary<Guid, Guid> templateTypesMap, IDictionary<Guid, Guid> selectableListsMap)
        {
            var libraryTemplates = await Repository
                .GetAll()
                .Where(t => t.IsActive && t.CompanyId == null)
                .ToListAsync();

            var templatesMap = new Dictionary<Guid, Guid>();
            foreach (var libraryTemplate in libraryTemplates)
            {
                var companyTemplateId = Guid.NewGuid();
                var libraryTemplateId = libraryTemplate.Id;

                templatesMap.Add(libraryTemplateId, companyTemplateId);

                var companyTemplate = new Template
                {
                    Id = companyTemplateId,
                    LibraryTemplateId = libraryTemplateId,
                    CompanyId = newCompanyId,
                    DefaultTemplateHtml = libraryTemplate.DefaultTemplateHtml,
                    DetailedTemplateHtml = _selectableItemsService
                        .ReplaceSelectableListIds(libraryTemplate.DetailedTemplateHtml, selectableListsMap),
                    InitialDetailedTemplateHtml = string.Empty,
                    Title = libraryTemplate.Title,
                    ReportTitle = libraryTemplate.ReportTitle,
                    Version = libraryTemplate.Version,
                    IsActive = libraryTemplate.IsActive,
                    TemplateOrder = libraryTemplate.TemplateOrder,
                    IsRequired = libraryTemplate.IsRequired,
                    IsHistorical = libraryTemplate.IsHistorical,
                    TemplateTypeId = templateTypesMap[libraryTemplate.TemplateTypeId]
                };

                Repository.Add(companyTemplate);
            }

            return templatesMap;
        }

        public async Task<Dictionary<Guid, Guid>> ImportFromLibrary(TemplatesImportPatchVm importedTemplates)
        {
            var companyId = importedTemplates.CompanyId;
            var libraryTemplateIds = importedTemplates.LibraryEntityIds;

            var libraryWithAlreadyImportedTemplates = await Repository.GetAll()
                .Include(t => t.TemplateSelectableLists)
                .Include(t => t.TemplateExpressions)
                .Where(t => t.CompanyId == null && libraryTemplateIds.Contains(t.Id) ||
                            t.CompanyId == companyId && t.LibraryTemplateId != null
                                                     && libraryTemplateIds.Contains(t.LibraryTemplateId.Value))
                .ToListAsync();

            var libraryImportedTemplateMap =
                libraryWithAlreadyImportedTemplates
                    .Where(t => t.CompanyId == companyId && t.LibraryTemplateId != null)
                    .Select(t => new {LibraryTemplateId = t.LibraryTemplateId.Value, CompanyTemplateId = t.Id})
                    .ToDictionary(t => t.LibraryTemplateId, t => t.CompanyTemplateId);

            var libraryTemplates =
                libraryWithAlreadyImportedTemplates
                    .Where(c => c.CompanyId == null)
                    .ToList();

            var libraryImportedTemplateIds =
                libraryImportedTemplateMap.Keys;

            var newLibraryTemplatesImport = libraryTemplates
                .Where(c => !libraryImportedTemplateIds.Contains(c.Id))
                .ToList();

            if (!newLibraryTemplatesImport.Any())
                return libraryImportedTemplateMap;

            var templateTypesMap = await _templateTypeService
                .ImportFromLibrary(new List<Guid> {importedTemplates.LibraryTemplateTypeId},
                    importedTemplates.CompanyId);

            foreach (var template in newLibraryTemplatesImport)
            {
                var librarySelectableListIds = template.TemplateSelectableLists
                    .Select(st => st.SelectableListId)
                    .ToList();

                var selectableListMap = await _selectableListService
                    .ImportFromLibrary(librarySelectableListIds, companyId);

                var expressionIds = template.TemplateExpressions
                    .Select(st => st.ExpressionId)
                    .ToList();

                var expressionMap = await _expressionService
                    .ImportFromLibrary(expressionIds, companyId);

                var newTemplateId = Guid.NewGuid();
                var newTemplate = new Template
                {
                    Id = newTemplateId,
                    CompanyId = companyId,
                    Title = template.Title,
                    Version = template.Version,
                    LibraryTemplateId = template.Id,
                    ReportTitle = template.ReportTitle,
                    DetailedTemplateHtml = _selectableItemsService
                        .ReplaceSelectableListIds(template.DetailedTemplateHtml, selectableListMap),
                    DefaultTemplateHtml = template.DefaultTemplateHtml,
                    IsRequired = template.IsRequired,
                    IsHistorical = template.IsHistorical,
                    TemplateTypeId = templateTypesMap[template.TemplateTypeId]
                };

                newTemplate.DetailedTemplateHtml = _expressionItemsService
                    .ReplaceExpressionIds(newTemplate.DetailedTemplateHtml, expressionMap);

                foreach (var libraryExpressionMap in expressionMap)
                {
                    _templateExpressionRepository.Add(new TemplateExpression
                    {
                        TemplateId = newTemplateId,
                        ExpressionId = libraryExpressionMap.Value
                    });
                }

                foreach (var librarySelectableListMap in selectableListMap)
                {
                    _templateSelectableListRepository.Add(new TemplateSelectableList
                    {
                        TemplateId = newTemplateId,
                        SelectableListId = librarySelectableListMap.Value
                    });
                }

                libraryImportedTemplateMap.Add(template.Id, newTemplateId);

                Repository.Add(newTemplate);

                await _unitOfWork.Commit();
            }

            return libraryImportedTemplateMap;
        }

        public async Task SyncWithLibraryTemplate(Guid id)
        {
            var template = await Repository.GetAll()
                .Include(t => t.LibraryTemplate)
                .Include(t => t.TemplateSelectableLists)
                .Include(t => t.LibraryTemplate.TemplateExpressions)
                .Include(t => t.LibraryTemplate.TemplateSelectableLists)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (template == null)
                return;

            var libraryTemplate = template.LibraryTemplate;

            if (libraryTemplate == null)
                throw new ArgumentNullException(nameof(template.LibraryTemplate));

            if (template.CompanyId == null)
                throw new ArgumentNullException(nameof(template.CompanyId));

            var selectableListIdsUsedInLibraryTemplate =
                template.LibraryTemplate.TemplateSelectableLists
                    .Select(l => l.SelectableListId)
                    .ToList();

            var selectableListMap = await _selectableListService
                .ImportFromLibrary(selectableListIdsUsedInLibraryTemplate, template.CompanyId.Value);

            var expressionIdsUsedInLibraryTemplate =
                template.LibraryTemplate.TemplateExpressions
                    .Select(l => l.ExpressionId)
                    .ToList();

            var expressionMap = await _expressionService
                .ImportFromLibrary(expressionIdsUsedInLibraryTemplate, template.CompanyId.Value);

            template.DefaultTemplateHtml =
                template.LibraryTemplate.DefaultTemplateHtml;

            template.DetailedTemplateHtml = _selectableItemsService
                .ReplaceSelectableListIds(libraryTemplate.DetailedTemplateHtml, selectableListMap);

            template.DetailedTemplateHtml = _expressionItemsService
                .ReplaceExpressionIds(template.DetailedTemplateHtml, expressionMap);

            template.Version = libraryTemplate.Version;

            var previousTemplateSelectableLists =
                template.TemplateSelectableLists;

            if (previousTemplateSelectableLists != null && previousTemplateSelectableLists.Any())
                previousTemplateSelectableLists.RemoveAll(l => true);

            var previousTemplateExpressions =
                template.TemplateExpressions;

            if (previousTemplateExpressions != null && previousTemplateExpressions.Any())
                previousTemplateExpressions.RemoveAll(l => true);

            foreach (var keyValuePair in expressionMap)
            {
                if (template.TemplateExpressions == null)
                    template.TemplateExpressions = new List<TemplateExpression>();

                template.TemplateExpressions.Add(new TemplateExpression
                {
                    TemplateId = template.Id,
                    ExpressionId = keyValuePair.Value
                });
            }

            foreach (var keyValuePair in selectableListMap)
            {
                if (template.TemplateSelectableLists == null)
                    template.TemplateSelectableLists = new List<TemplateSelectableList>();
                
                template.TemplateSelectableLists.Add(new TemplateSelectableList
                {
                    TemplateId = template.Id,
                    SelectableListId = keyValuePair.Value
                });
            }

            await _unitOfWork.Commit();
        }

        public IQueryable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions)
        {
            return Repository.GetAll().Where(t => t.IsActive && t.CompanyId == null)
                .ProjectTo<LookupViewModel>();
        }

        private async Task AdjustTemplatesOrders(int templateTemplateOrder, Guid templateTypeId)
        {
            var templates = await Repository.GetAll()
                .Where(t => t.TemplateTypeId == templateTypeId && t.TemplateOrder > templateTemplateOrder &&
                            t.TemplateOrder != null)
                .ToListAsync();

            if (templates.Count > 0)
                templates.ForEach(t => t.TemplateOrder = t.TemplateOrder.Value - 1);
        }
    }
}