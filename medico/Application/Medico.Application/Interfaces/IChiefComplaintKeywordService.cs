using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IChiefComplaintKeywordService
    {
        Task<ChiefComplaintKeywordViewModel> GetByValue(string value);

        Task<IEnumerable<ChiefComplaintKeywordViewModel>> GetByIcdCodeId(Guid icdCodeId);

        Task CreateIcdCodeMapping(MappingIcdCodeChiefComplaintKeywordViewModel mappingIcdCodeChiefComplaintKeywordViewModel);

        Task DeleteIcdCodeMapping(Guid keywordId, Guid icdCodeId);

        Task DeleteIcdCodeMapping(string keyword, Guid icdCodeId);

        Task<IEnumerable<ChiefComplaintKeywordInfoViewModel>> GetByKeywords(IEnumerable<string> keywords,
            Guid companyId);

        Task<bool> CheckMappingExistence(Guid icdCodeId, string keyword);
    }
}
