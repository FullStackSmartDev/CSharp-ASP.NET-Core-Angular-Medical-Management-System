using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.Services.PatientChart;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.PatientChartDocument;

namespace Medico.Application.Interfaces
{
    public interface IPatientChartDocumentNodeService
    {
        IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions);

        Task<PatientChartDocumentNodeViewModel> GetById(Guid patientChartDocumentId);

        Task<PatientChartDocumentVersionVm> GetWithVersionById(Guid id);

        PatientChartNode GetPatientChartDocumentCopy(PatientChartDocumentNodeViewModel patientChartDocument);

        Task AddToCompanyFromLibrary(Guid newCompanyId, IDictionary<Guid, Guid> templatesMap,
            IDictionary<Guid, Guid> templateTypesMap);

        IQueryable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions);

        Task<List<LookupViewModel>> GetByFilter(PatientChartDocumentSearchVm searchFilterVm);

        Task<List<PatientChartNode>> ImportFromLibrary(PatientChartDocumentsImportVm importedDocuments);

        Task SyncWithLibrary(Guid id, Guid patientChartRootNodeId);
    }
}