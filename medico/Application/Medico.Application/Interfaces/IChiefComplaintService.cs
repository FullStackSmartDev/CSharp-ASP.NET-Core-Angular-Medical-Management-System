using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Template;

namespace Medico.Application.Interfaces
{
    public interface IChiefComplaintService
    {
        IQueryable<ChiefComplaintViewModel> GetAll();

        Task<ChiefComplaintViewModel> GetById(Guid id);

        Task<ChiefComplaintViewModel> GetByName(string name, Guid companyId);

        Task<ChiefComplaintViewModel> Create(ChiefComplaintViewModel chiefComplaintViewModel);

        Task<ChiefComplaintViewModel> Update(ChiefComplaintViewModel chiefComplaintViewModel);

        Task Delete(Guid id);

        Task SaveChiefComplaintTemplates(Guid id, IEnumerable<Guid> templateIds);

        Task SaveChiefComplaintKeywords(Guid id, IEnumerable<string> keywords);

        Task<IEnumerable<ChiefComplaintKeywordViewModel>> GetChiefComplaintKeywords(Guid id);

        Task<IEnumerable<TemplateVm>> GetChiefComplaintTemplatesByType(Guid id, Guid templateTypeId);

        Task<IQueryable<ChiefComplaintTemplateKeywordViewModel>> GetChiefComplaintTemplatesKeywords(CompanyDxOptionsViewModel loadOptions);

        Task AddKeywords(AddKeywordsViewModel addKeywordsViewModel);

        Task<IEnumerable<ChiefComplaintWithKeywordsViewModel>> GetChiefComplaintWithKeywords(Guid companyId);
        
        IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions);
    }
}