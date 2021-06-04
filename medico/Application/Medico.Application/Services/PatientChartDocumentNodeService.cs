using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.Services.PatientChart;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.PatientChartDocument;
using Medico.Application.ViewModels.Template;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Medico.Application.Services
{
    public class PatientChartDocumentNodeService
        : BaseDeletableByIdService<PatientChartDocumentNode, PatientChartDocumentNodeViewModel>,
            IPatientChartDocumentNodeService
    {
        private readonly ITemplateService _templateService;
        private readonly ITemplateTypeService _templateTypeService;

        private readonly JsonSerializerSettings _jsonSerializerSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        public PatientChartDocumentNodeService(IPatientChartDocumentNodeRepository repository,
            IMapper mapper,
            ITemplateService templateService,
            ITemplateTypeService templateTypeService)
            : base(repository, mapper)
        {
            _templateService = templateService;
            _templateTypeService = templateTypeService;
        }

        public IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<LookupViewModel>()
                    .AsQueryable();

            return Repository.GetAll()
                .Where(d => d.CompanyId == companyId)
                .ProjectTo<LookupViewModel>();
        }

        public async Task<PatientChartDocumentVersionVm> GetWithVersionById(Guid id)
        {
            var patientChartDocumentNode = await Repository.GetAll()
                .Include(d => d.LibraryPatientChartDocumentNode)
                .FirstOrDefaultAsync(d => d.Id == id);

            return Mapper.Map<PatientChartDocumentVersionVm>(patientChartDocumentNode);
        }

        public PatientChartNode GetPatientChartDocumentCopy(PatientChartDocumentNodeViewModel patientChartDocument)
        {
            var patientChartDocumentNode =
                JsonConvert.DeserializeObject<PatientChartNode>(patientChartDocument
                    .PatientChartDocumentNodeJsonString);

            ReplacePatientChartNodeIdsAndParentIds(patientChartDocumentNode);
            SetIsPredefinedFlagToFalse(patientChartDocumentNode);

            return patientChartDocumentNode;
        }

        public async Task AddToCompanyFromLibrary(Guid newCompanyId,
            IDictionary<Guid, Guid> templatesMap, IDictionary<Guid, Guid> templateTypesMap)
        {
            var libraryDocumentNodes = await Repository
                .GetAll()
                .Where(pcn => pcn.CompanyId == null)
                .ToListAsync();

            foreach (var libraryDocument in libraryDocumentNodes)
            {
                var companyPatientChartDocument = new PatientChartDocumentNode
                {
                    CompanyId = newCompanyId,
                    LibraryPatientChartDocumentNodeId = libraryDocument.Id,
                    Name = libraryDocument.Name,
                    Title = libraryDocument.Title,
                    Version = libraryDocument.Version
                };

                var libraryPatientChartDocumentNode = JsonConvert
                    .DeserializeObject<PatientChartNode>(libraryDocument.PatientChartDocumentNodeJsonString);

                AdjustPatientChartDocumentNodesTemplatesIds(libraryPatientChartDocumentNode, templatesMap);

                AdjustPatientChartDocumentNodesTemplateTypeIds(libraryPatientChartDocumentNode, templateTypesMap);

                ReplacePatientChartNodeIdsAndParentIds(libraryPatientChartDocumentNode);

                companyPatientChartDocument.Id = libraryPatientChartDocumentNode.Id;

                companyPatientChartDocument.PatientChartDocumentNodeJsonString =
                    JsonConvert.SerializeObject(libraryPatientChartDocumentNode, _jsonSerializerSettings);

                Repository.Add(companyPatientChartDocument);
            }
        }

        public IQueryable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions)
        {
            return Repository.GetAll()
                .Where(d => d.CompanyId == null)
                .ProjectTo<LookupViewModel>();
        }

        public Task<List<LookupViewModel>> GetByFilter(PatientChartDocumentSearchVm searchFilterVm)
        {
            var query = Repository.GetAll();

            var applyPatientChartNodeFilter =
                searchFilterVm.TemplateId.HasValue || searchFilterVm.TemplateTypeId.HasValue;

            if (applyPatientChartNodeFilter)
            {
                var patientChartNodeSearchVm = new PatientChartNodeSearchVm
                {
                    TemplateId = searchFilterVm.TemplateId,
                    TemplateTypeId = searchFilterVm.TemplateTypeId
                };

                return GetByPatientChartNodeFilter(query, patientChartNodeSearchVm, searchFilterVm.CompanyId);
            }

            var excludeImported = searchFilterVm.ExcludeImported;
            if (excludeImported.HasValue)
                return GetDocumentsNotImportedToCompany(searchFilterVm.CompanyId);

            var title = searchFilterVm.Title;
            if (!string.IsNullOrEmpty(title))
                query = query.Where(d => d.Title == title);

            return query.Where(d => d.CompanyId == searchFilterVm.CompanyId)
                .Take(searchFilterVm.Take)
                .ProjectTo<LookupViewModel>()
                .ToListAsync();
        }

        private async Task<List<LookupViewModel>> GetByPatientChartNodeFilter(
            IQueryable<PatientChartDocumentNode> query,
            PatientChartNodeSearchVm patientChartNodeSearchVm, Guid? companyId)
        {
            var documents =
                await query.Where(d => d.CompanyId == companyId)
                    .ToListAsync();

            var filteredDocuments = new List<LookupViewModel>();

            foreach (var document in documents)
            {
                var documentNodes = JsonConvert
                    .DeserializeObject<PatientChartNode>(document.PatientChartDocumentNodeJsonString);

                var doesDocumentContainNode = false;
                var templateId = patientChartNodeSearchVm.TemplateId;
                if (templateId.HasValue)
                    doesDocumentContainNode =
                        DoesDocumentContainTemplateNode(templateId.Value, documentNodes);

                var templateTypeId = patientChartNodeSearchVm.TemplateTypeId;
                if (templateTypeId.HasValue)
                    doesDocumentContainNode =
                        DoesDocumentContainTemplateListNode(templateTypeId.Value, documentNodes);

                if (doesDocumentContainNode)
                    filteredDocuments.Add(Mapper.Map<LookupViewModel>(document));
            }

            return filteredDocuments;
        }

        private bool DoesDocumentContainTemplateListNode(Guid templateTypeId,
            PatientChartNode documentNodes)
        {
            return DoesDocumentContainNode(node =>
            {
                var nodeType = node.Type;
                if (nodeType != PatientChartNodeType.TemplateListNode)
                    return false;

                var nodeTemplateTypeId = node.Attributes.NodeSpecificAttributes.TemplateTypeId;
                if (!nodeTemplateTypeId.HasValue)
                    throw new NullReferenceException(nameof(nodeTemplateTypeId));

                return nodeTemplateTypeId.Value == templateTypeId;
            }, documentNodes);
        }

        private bool DoesDocumentContainTemplateNode(Guid templateId,
            PatientChartNode documentNodes)
        {
            return DoesDocumentContainNode(node =>
            {
                var nodeType = node.Type;
                if (nodeType != PatientChartNodeType.TemplateNode)
                    return false;

                var nodeTemplateId = node.Attributes.NodeSpecificAttributes.TemplateId;
                if (!nodeTemplateId.HasValue)
                    throw new NullReferenceException(nameof(nodeTemplateId));

                return nodeTemplateId.Value == templateId;
            }, documentNodes);
        }

        private static bool DoesDocumentContainNode(Func<PatientChartNode, bool> filter,
            PatientChartNode node)
        {
            if (filter(node))
                return true;

            var children = node.Children;
            if (children == null || !children.Any())
                return false;

            return children.Any(childNode => DoesDocumentContainNode(filter, childNode));
        }

        public async Task<List<PatientChartNode>> ImportFromLibrary(PatientChartDocumentsImportVm importedDocuments)
        {
            var companyId = importedDocuments.CompanyId;
            var importedPatientChartDocuments = new List<PatientChartNode>();

            var libraryDocumentIdsToImport =
                importedDocuments.LibraryEntityIds;

            var libraryDocumentsToImport = await Repository
                .GetAll()
                .Where(d => d.CompanyId == null && libraryDocumentIdsToImport.Contains(d.Id))
                .ToListAsync();

            foreach (var libraryDocument in libraryDocumentsToImport)
            {
                var companyPatientChartDocument = new PatientChartDocumentNode
                {
                    CompanyId = companyId,
                    LibraryPatientChartDocumentNodeId = libraryDocument.Id,
                    Name = libraryDocument.Name,
                    Title = libraryDocument.Title,
                    Version = libraryDocument.Version
                };

                var libraryPatientChartDocumentNode = JsonConvert
                    .DeserializeObject<PatientChartNode>(libraryDocument.PatientChartDocumentNodeJsonString);

                await AdjustTemplates(libraryPatientChartDocumentNode, companyId);

                await AdjustTemplateTypes(libraryPatientChartDocumentNode, companyId);

                ReplacePatientChartNodeIdsAndParentIds(libraryPatientChartDocumentNode,
                    importedDocuments.PatientChartRootNodeId);

                companyPatientChartDocument.Id = libraryPatientChartDocumentNode.Id;

                companyPatientChartDocument.PatientChartDocumentNodeJsonString =
                    JsonConvert.SerializeObject(libraryPatientChartDocumentNode, _jsonSerializerSettings);

                importedPatientChartDocuments.Add(libraryPatientChartDocumentNode);

                Repository.Add(companyPatientChartDocument);
            }

            await Repository.SaveChangesAsync();

            return importedPatientChartDocuments;
        }

        public async Task SyncWithLibrary(Guid id, Guid patientChartRootNodeId)
        {
            var patientChartDocument = await Repository
                .GetAll()
                .Include(d => d.LibraryPatientChartDocumentNode)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (patientChartDocument == null)
                return;

            if (!patientChartDocument.CompanyId.HasValue)
                return;

            var companyId = patientChartDocument.CompanyId.Value;

            var libraryPatientChartDocument =
                patientChartDocument.LibraryPatientChartDocumentNode;

            if (libraryPatientChartDocument == null)
                return;

            var libraryPatientChartDocumentNode = JsonConvert
                .DeserializeObject<PatientChartNode>(libraryPatientChartDocument.PatientChartDocumentNodeJsonString);

            await AdjustTemplates(libraryPatientChartDocumentNode, companyId);

            await AdjustTemplateTypes(libraryPatientChartDocumentNode, companyId);

            libraryPatientChartDocumentNode.Id = patientChartDocument.Id;

            ReplacePatientChartNodeParentIds(libraryPatientChartDocumentNode, patientChartRootNodeId);

            patientChartDocument.PatientChartDocumentNodeJsonString =
                JsonConvert.SerializeObject(libraryPatientChartDocumentNode, _jsonSerializerSettings);

            patientChartDocument.Version = libraryPatientChartDocument.Version;

            await Repository.SaveChangesAsync();
        }

        private async Task AdjustTemplates(PatientChartNode libraryPatientChartDocumentNode, Guid companyId)
        {
            var templatesMap =
                await ProcessLibraryTemplateImporting(libraryPatientChartDocumentNode, companyId);

            AdjustPatientChartDocumentNodesTemplatesIds(libraryPatientChartDocumentNode, templatesMap);
        }

        private async Task AdjustTemplateTypes(PatientChartNode libraryPatientChartDocumentNode, Guid companyId)
        {
            var templateTypesMap =
                await ProcessLibraryTemplateTypesImporting(libraryPatientChartDocumentNode, companyId);

            AdjustPatientChartDocumentNodesTemplateTypeIds(libraryPatientChartDocumentNode, templateTypesMap);
        }

        private async Task<IDictionary<Guid, Guid>> ProcessLibraryTemplateTypesImporting(
            PatientChartNode libraryPatientChartDocumentNode,
            Guid companyId)
        {
            var libraryTemplateTypeIdsUsedInDocument = new List<Guid>();

            SetTemplateTypeIdsUsedInPatientChartDocument(libraryPatientChartDocumentNode,
                libraryTemplateTypeIdsUsedInDocument);

            var templateTypesUsedInPatientChartDocument = await _templateTypeService
                .GetAll()
                .Where(t => libraryTemplateTypeIdsUsedInDocument.Contains(t.Id))
                .Select(t => t.Id)
                .ToListAsync();

            return await _templateTypeService.ImportFromLibrary(templateTypesUsedInPatientChartDocument, companyId);
        }

        private async Task<Dictionary<Guid, Guid>> ProcessLibraryTemplateImporting(
            PatientChartNode libraryPatientChartDocumentNode, Guid companyId)
        {
            var libraryTemplateIdsUsedInDocument = new List<Guid>();

            SetTemplateIdsUsedInPatientChartDocument(libraryPatientChartDocumentNode,
                libraryTemplateIdsUsedInDocument);

            var templatesUsedInPatientChartDocument = await _templateService
                .GetAll()
                .Where(t => libraryTemplateIdsUsedInDocument.Contains(t.Id))
                .Select(t => new {t.Id, t.TemplateTypeId})
                .ToListAsync();

            var templatesGroupedByType = templatesUsedInPatientChartDocument
                .GroupBy(t => t.TemplateTypeId);

            var templatesMap = new Dictionary<Guid, Guid>();

            foreach (var templates in templatesGroupedByType)
            {
                var templatesImportPatchVm = new TemplatesImportPatchVm
                {
                    CompanyId = companyId,
                    LibraryEntityIds =
                        templates.Select(t => t.Id).ToList(),
                    LibraryTemplateTypeId = templates.Key
                };

                var templatesMapByType =
                    await _templateService.ImportFromLibrary(templatesImportPatchVm);

                foreach (var templateMapByType in templatesMapByType)
                {
                    templatesMap.Add(templateMapByType.Key, templateMapByType.Value);
                }
            }

            return templatesMap;
        }

        private void SetTemplateIdsUsedInPatientChartDocument(PatientChartNode patientChartDocumentNode,
            ICollection<Guid> templateIds)
        {
            if (patientChartDocumentNode.Type == PatientChartNodeType.TemplateNode)
            {
                var templateId = patientChartDocumentNode
                    .Attributes
                    .NodeSpecificAttributes
                    .TemplateId;

                if (templateId == null)
                    throw new ArgumentNullException(nameof(templateId));

                var templateIdValue = templateId.Value;

                if (!templateIds.Contains(templateIdValue))
                    templateIds.Add(templateIdValue);
            }

            var children = patientChartDocumentNode.Children;
            if (children == null || !children.Any())
                return;

            foreach (var patientChartNode in children)
            {
                SetTemplateIdsUsedInPatientChartDocument(patientChartNode, templateIds);
            }
        }

        private void SetTemplateTypeIdsUsedInPatientChartDocument(
            PatientChartNode patientChartDocumentNode, ICollection<Guid> templateTypeIds)
        {
            if (patientChartDocumentNode.Type == PatientChartNodeType.TemplateListNode)
            {
                var templateTypeId = patientChartDocumentNode
                    .Attributes
                    .NodeSpecificAttributes
                    .TemplateTypeId;

                if (templateTypeId == null)
                    throw new ArgumentNullException(nameof(templateTypeId));

                var templateIdValue = templateTypeId.Value;

                if (!templateTypeIds.Contains(templateIdValue))
                    templateTypeIds.Add(templateIdValue);
            }

            var children = patientChartDocumentNode.Children;
            if (children == null || !children.Any())
                return;

            foreach (var patientChartNode in children)
            {
                SetTemplateTypeIdsUsedInPatientChartDocument(patientChartNode, templateTypeIds);
            }
        }

        private async Task<List<LookupViewModel>> GetDocumentsNotImportedToCompany(Guid? companyId)
        {
            if (companyId == null)
                throw new ArgumentNullException(nameof(companyId));

            var libraryDocumentsQuery =
                Repository.GetAll()
                    .Where(d => d.CompanyId == null)
                    .ProjectTo<LookupViewModel>();

            var companyImportedDocumentsIdsQuery = Repository.GetAll()
                .Where(d => d.CompanyId == companyId.Value && d.LibraryPatientChartDocumentNodeId != null)
                .Select(t => t.LibraryPatientChartDocumentNodeId.Value);

            var documentMaps = await libraryDocumentsQuery
                .GroupJoin(companyImportedDocumentsIdsQuery,
                    libraryDocument => libraryDocument.Id,
                    companyImportedDocumentId => companyImportedDocumentId,
                    (libraryDocument, companyImportedDocumentId) => new
                        {libraryDocument, companyImportedDocumentId})
                .SelectMany(
                    map => map.companyImportedDocumentId.DefaultIfEmpty(),
                    (map, companyImportedDocumentId) => new {map.libraryDocument, companyImportedDocumentId})
                .ToListAsync();

            return documentMaps.Where(map => map.companyImportedDocumentId == Guid.Empty)
                .Select(x => x.libraryDocument)
                .ToList();
        }

        private static void AdjustPatientChartDocumentNodesTemplatesIds(
            PatientChartNode libraryPatientChartDocumentNode,
            IDictionary<Guid, Guid> templatesMap)
        {
            var patientChartNodeType = libraryPatientChartDocumentNode.Type;
            if (patientChartNodeType == PatientChartNodeType.TemplateNode)
            {
                var templateId = libraryPatientChartDocumentNode
                    .Attributes
                    .NodeSpecificAttributes
                    .TemplateId;

                if (!templateId.HasValue)
                    throw new NullReferenceException(nameof(templateId));

                libraryPatientChartDocumentNode.Attributes.NodeSpecificAttributes.TemplateId =
                    templatesMap[templateId.Value];
            }

            var patientChartNodeChildren =
                libraryPatientChartDocumentNode.Children;

            if (patientChartNodeChildren == null || !patientChartNodeChildren.Any())
                return;

            foreach (var patientChartNodeChild in patientChartNodeChildren)
            {
                AdjustPatientChartDocumentNodesTemplatesIds(patientChartNodeChild, templatesMap);
            }
        }

        private static void AdjustPatientChartDocumentNodesTemplateTypeIds(
            PatientChartNode libraryPatientChartDocumentNode,
            IDictionary<Guid, Guid> templateTypesMap)
        {
            var patientChartNodeType = libraryPatientChartDocumentNode.Type;
            if (patientChartNodeType == PatientChartNodeType.TemplateListNode)
            {
                var templateTypeId = libraryPatientChartDocumentNode
                    .Attributes
                    .NodeSpecificAttributes
                    .TemplateTypeId;

                if (!templateTypeId.HasValue)
                    throw new NullReferenceException(nameof(templateTypeId));

                libraryPatientChartDocumentNode.Attributes.NodeSpecificAttributes.TemplateTypeId =
                    templateTypesMap[templateTypeId.Value];
            }

            var patientChartNodeChildren =
                libraryPatientChartDocumentNode.Children;

            if (patientChartNodeChildren == null || !patientChartNodeChildren.Any())
                return;

            foreach (var patientChartNodeChild in patientChartNodeChildren)
            {
                AdjustPatientChartDocumentNodesTemplateTypeIds(patientChartNodeChild, templateTypesMap);
            }
        }

        private static void SetIsPredefinedFlagToFalse(PatientChartNode patientChartNode)
        {
            patientChartNode.Attributes.IsPredefined = false;

            var patientChartNodeChildren = patientChartNode.Children;
            if (patientChartNodeChildren == null || !patientChartNodeChildren.Any())
                return;

            foreach (var patientChartNodeChild in patientChartNodeChildren)
            {
                SetIsPredefinedFlagToFalse(patientChartNodeChild);
            }
        }

        private static void ReplacePatientChartNodeIdsAndParentIds(PatientChartNode patientChartNode,
            Guid? patientChartDocumentParentId = null)
        {
            var newPatientChartNodeId = Guid.NewGuid();

            if (patientChartDocumentParentId.HasValue)
                patientChartNode.ParentId =
                    patientChartDocumentParentId.Value;

            patientChartNode.Id = newPatientChartNodeId;

            var patientChartNodeChildren = patientChartNode.Children;
            if (patientChartNodeChildren == null || !patientChartNodeChildren.Any())
                return;

            foreach (var patientChartNodeChild in patientChartNodeChildren)
            {
                ReplacePatientChartNodeIdsAndParentIds(patientChartNodeChild, newPatientChartNodeId);
            }
        }

        private static void ReplacePatientChartNodeParentIds(PatientChartNode patientChartNode,
            Guid patientChartDocumentParentId)
        {
            patientChartNode.ParentId = patientChartDocumentParentId;

            var patientChartNodeChildren = patientChartNode.Children;
            if (patientChartNodeChildren == null || !patientChartNodeChildren.Any())
                return;

            foreach (var patientChartNodeChild in patientChartNodeChildren)
            {
                ReplacePatientChartNodeIdsAndParentIds(patientChartNodeChild, patientChartNode.Id);
            }
        }
    }
}