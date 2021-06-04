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
    public class ChiefComplaintKeywordService : IChiefComplaintKeywordService
    {
        private readonly IChiefComplaintKeywordRepository _chiefComplaintKeywordRepository;
        private readonly IMapper _mapper;
        private readonly IIcdCodeChiefComplaintKeywordRepository _icdCodeChiefComplaintKeywordRepository;
        private readonly IIcdCodeRepository _icdCodeRepository;

        public ChiefComplaintKeywordService(IChiefComplaintKeywordRepository chiefComplaintKeywordRepository,
            IMapper mapper,
            IIcdCodeChiefComplaintKeywordRepository icdCodeChiefComplaintKeywordRepository,
            IIcdCodeRepository icdCodeRepository)
        {
            _chiefComplaintKeywordRepository = chiefComplaintKeywordRepository;
            _mapper = mapper;
            _icdCodeChiefComplaintKeywordRepository = icdCodeChiefComplaintKeywordRepository;
            _icdCodeRepository = icdCodeRepository;
        }

        public async Task<ChiefComplaintKeywordViewModel> GetByValue(string value)
        {
            var chiefComplaintKeyword = await _chiefComplaintKeywordRepository
                .GetAll().FirstOrDefaultAsync(k => k.Value == value.ToUpperInvariant());
            if (chiefComplaintKeyword == null)
                return null;

            return _mapper.Map<ChiefComplaintKeywordViewModel>(chiefComplaintKeyword);
        }

        public async Task<IEnumerable<ChiefComplaintKeywordViewModel>> GetByIcdCodeId(Guid icdCodeId)
        {
            var keywords = await _icdCodeRepository
                .GetAll()
                .Include(c => c.IcdCodeChiefComplaintKeywords)
                .Where(c => c.Id == icdCodeId)
                .SelectMany(c => c.IcdCodeChiefComplaintKeywords)
                .Select(ck => ck.ChiefComplaintKeyword)
                .ProjectTo<ChiefComplaintKeywordViewModel>()
                .ToListAsync();
            return keywords;
        }

        public async Task CreateIcdCodeMapping(MappingIcdCodeChiefComplaintKeywordViewModel mappingIcdCodeChiefComplaintKeywordViewModel)
        {
            var keywordValue = mappingIcdCodeChiefComplaintKeywordViewModel.KeywordValue;
            var icdCodeId = mappingIcdCodeChiefComplaintKeywordViewModel.IcdCodeId;

            var keyword = await _chiefComplaintKeywordRepository.GetAll()
                .FirstOrDefaultAsync(k => k.Value == keywordValue.ToUpperInvariant());

            if (keyword == null)
            {
                var newKeyword = new ChiefComplaintKeyword
                {
                    Value = keywordValue
                };

                _chiefComplaintKeywordRepository.Add(newKeyword);
                await _chiefComplaintKeywordRepository.SaveChangesAsync();

                _icdCodeChiefComplaintKeywordRepository.Add(new IcdCodeChiefComplaintKeyword
                {
                    ChiefComplaintKeywordId = newKeyword.Id,
                    IcdCodeId = icdCodeId
                });

                await _icdCodeChiefComplaintKeywordRepository.SaveChangesAsync();
            }
            else
            {
                var mapping = await _icdCodeChiefComplaintKeywordRepository.GetAll()
                    .FirstOrDefaultAsync(kc => kc.IcdCodeId == icdCodeId && kc.ChiefComplaintKeywordId == keyword.Id);

                if (mapping == null)
                {
                    _icdCodeChiefComplaintKeywordRepository.Add(new IcdCodeChiefComplaintKeyword
                    {
                        ChiefComplaintKeywordId = keyword.Id,
                        IcdCodeId = icdCodeId
                    });

                    await _icdCodeChiefComplaintKeywordRepository.SaveChangesAsync();
                }
            }
        }

        public async Task DeleteIcdCodeMapping(Guid keywordId, Guid icdCodeId)
        {
            var mapping = await _icdCodeChiefComplaintKeywordRepository
                .GetAll()
                .FirstOrDefaultAsync(m => m.ChiefComplaintKeywordId == keywordId && m.IcdCodeId == icdCodeId);

            if (mapping != null)
            {
                _icdCodeChiefComplaintKeywordRepository.Remove(mapping);
                await _icdCodeChiefComplaintKeywordRepository.SaveChangesAsync();
            }
        }

        public async Task DeleteIcdCodeMapping(string keyword, Guid icdCodeId)
        {
            var icdCodeMapping = await _icdCodeChiefComplaintKeywordRepository
                .GetAll()
                .Include(m => m.ChiefComplaintKeyword)
                .FirstOrDefaultAsync(m => m.IcdCodeId == icdCodeId
                                          && string.Equals(keyword, m.ChiefComplaintKeyword.Value,
                                              StringComparison.InvariantCultureIgnoreCase));
            if (icdCodeMapping != null)
            {
                _icdCodeChiefComplaintKeywordRepository.Remove(icdCodeMapping);
                await _icdCodeChiefComplaintKeywordRepository.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<ChiefComplaintKeywordInfoViewModel>> GetByKeywords(IEnumerable<string> keywords,
            Guid companyId)
        {
            var keywordsInUpperCase = keywords.Select(k => k.ToUpperInvariant()).ToList();

            var chiefComplaintKeywords = await _chiefComplaintKeywordRepository.GetAll()
                .Where(cck => keywordsInUpperCase.Contains(cck.Value.ToUpperInvariant())
                              || keywordsInUpperCase.Contains(cck.Value.ToUpperInvariant() + "S"))
                .Include(cck => cck.ChiefComplaintsKeywords)
                .SelectMany(cck => cck.ChiefComplaintsKeywords)
                .Where(cck => cck.ChiefComplaint.CompanyId == companyId)
                .Select(cck => new ChiefComplaintKeywordInfoViewModel
                {
                    Id = cck.ChiefComplaintId,
                    Title = cck.ChiefComplaint.Title,
                    Value = cck.Keyword.Value
                }).ToListAsync();

            return chiefComplaintKeywords;
        }

        public async Task<bool> CheckMappingExistence(Guid icdCodeId, string keyword)
        {
            var icdCodeMapping = await _icdCodeChiefComplaintKeywordRepository
                .GetAll()
                .Include(m => m.ChiefComplaintKeyword)
                .FirstOrDefaultAsync(m => m.IcdCodeId == icdCodeId
                                          && string.Equals(keyword, m.ChiefComplaintKeyword.Value,
                                              StringComparison.InvariantCultureIgnoreCase));
            return icdCodeMapping != null;
        }
    }
}