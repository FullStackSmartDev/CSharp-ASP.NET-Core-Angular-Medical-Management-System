using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class IcdCodeService : IIcdCodeService
    {
        private readonly IIcdCodeRepository _icdCodeRepository;
        private readonly IIcdCodeChiefComplaintKeywordRepository _icdCodeChiefComplaintKeywordRepository;
        private readonly IMapper _mapper;
        private readonly IDataSourceLoadOptionsHelper _dataSourceLoadOptionsHelper;

        public IcdCodeService(IIcdCodeRepository icdCodeRepository,
            IIcdCodeChiefComplaintKeywordRepository icdCodeChiefComplaintKeywordRepository,
            IMapper mapper,
            IDataSourceLoadOptionsHelper dataSourceLoadOptionsHelper)
        {
            _icdCodeRepository = icdCodeRepository;
            _icdCodeChiefComplaintKeywordRepository = icdCodeChiefComplaintKeywordRepository;
            _mapper = mapper;
            _dataSourceLoadOptionsHelper = dataSourceLoadOptionsHelper;
        }

        public IQueryable<IcdCodeViewModel> GetAll()
        {
            return _icdCodeRepository.GetAll()
                .ProjectTo<IcdCodeViewModel>();
        }

        public IQueryable<IcdCodeViewModel> GetAllForLookup(DxOptionsViewModel dxOptions, int lookupItemsCount)
        {
            dxOptions.PrimaryKey = new[] { "Id" };
            dxOptions.PaginateViaPrimaryKey = true;

            var takeItemsCount = dxOptions.Take;
            dxOptions.Take = takeItemsCount != 0 ? takeItemsCount : lookupItemsCount;

            var searchIcdCodeString = _dataSourceLoadOptionsHelper
                .GetSearchString(dxOptions);

            var isSearchIcdCodeStringExist = !string.IsNullOrEmpty(searchIcdCodeString);
            if (!isSearchIcdCodeStringExist)
                return GetAll();

            dxOptions.Filter = null;

            return _icdCodeRepository.GetAll()
                .Where(c => EF.Functions.Contains(c.Name, $"\"{searchIcdCodeString}\""))
                .ProjectTo<IcdCodeViewModel>();
        }

        public IQueryable<IcdCodeKeywordsViewModel> GetIcdCodeKeywords()
        {
            return _icdCodeRepository.GetAll()
                .Include(c => c.IcdCodeChiefComplaintKeywords)
                .Select(c => new IcdCodeKeywordsViewModel
                {
                    IcdCodeId = c.Id,
                    IcdCodeDescription = c.Name,
                    IcdCodeName = c.Code,
                    Keywords = c.IcdCodeChiefComplaintKeywords
                        .Select(ck => ck.ChiefComplaintKeyword.Value)
                })
                .Where(k => k.Keywords.Any());
        }

        public async Task<IcdCodeViewModel> GetById(Guid id)
        {
            var icdCode = await _icdCodeRepository.GetAll()
                .FirstOrDefaultAsync(c => c.Id == id);

            return icdCode == null
                ? null
                : _mapper.Map<IcdCodeViewModel>(icdCode);
        }

        public async Task<IEnumerable<IcdCodeViewModel>> GetIcdCodesMappedToKeyword(string keyword)
        {
            var mappedIcdCodes = await _icdCodeChiefComplaintKeywordRepository
                .GetAll()
                .Include(ck => ck.ChiefComplaintKeyword)
                .Where(ck => string.Equals(ck.ChiefComplaintKeyword.Value, keyword, StringComparison.InvariantCultureIgnoreCase))
                .Select(ck => ck.IcdCode)
                .ProjectTo<IcdCodeViewModel>()
                .ToListAsync();

            return mappedIcdCodes;
        }
    }
}
