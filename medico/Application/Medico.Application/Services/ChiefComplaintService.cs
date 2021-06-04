using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Template;
using Medico.Application.ViewModels.TemplateType;
using Medico.Domain.Constants;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace Medico.Application.Services
{
    public class ChiefComplaintService : BaseDeletableByIdService<ChiefComplaint, ChiefComplaintViewModel>, IChiefComplaintService
    {
        private readonly IChiefComplaintRepository _chiefComplaintRepository;
        private readonly IChiefComplaintTemplateRepository _chiefComplaintTemplateRepository;
        private readonly IChiefComplaintRelatedKeywordRepository _chiefComplaintRelatedKeywordRepository;
        private readonly IChiefComplaintKeywordRepository _chiefComplaintKeywordRepository;
        private readonly ITemplateService _templateService;
        private readonly ITemplateTypeService _templateTypeService;

        public ChiefComplaintService(IChiefComplaintRepository chiefComplaintRepository,
            IMapper mapper, IChiefComplaintTemplateRepository chiefComplaintTemplateRepository,
            IChiefComplaintRelatedKeywordRepository chiefComplaintRelatedKeywordRepository,
            IChiefComplaintKeywordRepository chiefComplaintKeywordRepository,
            ITemplateService templateTypeService,
            ITemplateTypeService templateTypeService1)
            : base(chiefComplaintRepository, mapper)
        {
            _chiefComplaintRepository = chiefComplaintRepository;
            _chiefComplaintTemplateRepository = chiefComplaintTemplateRepository;
            _chiefComplaintRelatedKeywordRepository = chiefComplaintRelatedKeywordRepository;
            _chiefComplaintKeywordRepository = chiefComplaintKeywordRepository;
            _templateService = templateTypeService;
            _templateTypeService = templateTypeService1;
        }

        public IQueryable<ChiefComplaintViewModel> GetAll()
        {
            return Repository
                .GetAll()
                .ProjectTo<ChiefComplaintViewModel>();
        }

        public async Task<ChiefComplaintViewModel> GetByName(string name, Guid companyId)
        {
            var chiefComplaint = await Repository.GetAll()
                .FirstOrDefaultAsync(c => c.Name == name && c.CompanyId == companyId);

            return chiefComplaint == null
                ? null
                : Mapper.Map<ChiefComplaintViewModel>(chiefComplaint);
        }

        public async Task Delete(Guid id)
        {
            var chiefComplaintTemplates = await _chiefComplaintTemplateRepository.GetAll()
                .Where(ct => ct.ChiefComplaintId == id)
                .ToArrayAsync();

            foreach (var chiefComplaintTemplate in chiefComplaintTemplates)
            {
                _chiefComplaintTemplateRepository.Remove(chiefComplaintTemplate);
            }

            await _chiefComplaintTemplateRepository.SaveChangesAsync();

            var chiefComplaintKeywords = await _chiefComplaintRelatedKeywordRepository.GetAll()
                .Where(k => k.ChiefComplaintId == id)
                .ToArrayAsync();

            foreach (var chiefComplaintKeyword in chiefComplaintKeywords)
            {
                _chiefComplaintRelatedKeywordRepository.Remove(chiefComplaintKeyword);
            }

            await _chiefComplaintRelatedKeywordRepository.SaveChangesAsync();

            await DeleteById(id);
        }

        public async Task SaveChiefComplaintTemplates(Guid id, IEnumerable<Guid> templateIds)
        {
            var chiefComplaintTemplates = await _chiefComplaintTemplateRepository.GetAll()
                .Where(ct => ct.ChiefComplaintId == id)
                .ToArrayAsync();

            foreach (var chiefComplaintTemplate in chiefComplaintTemplates)
            {
                _chiefComplaintTemplateRepository.Remove(chiefComplaintTemplate);
            }

            foreach (var templateId in templateIds)
            {
                var chiefComplaint = new ChiefComplaintTemplate
                {
                    ChiefComplaintId = id,
                    TemplateId = templateId
                };

                _chiefComplaintTemplateRepository.Add(chiefComplaint);
            }

            await _chiefComplaintTemplateRepository.SaveChangesAsync();
        }

        public async Task SaveChiefComplaintKeywords(Guid id, IEnumerable<string> keywords)
        {
            var chiefComplaintKeywords = await _chiefComplaintRelatedKeywordRepository.GetAll()
                .Where(k => k.ChiefComplaintId == id)
                .ToArrayAsync();

            foreach (var chiefComplaintKeyword in chiefComplaintKeywords)
            {
                _chiefComplaintRelatedKeywordRepository.Remove(chiefComplaintKeyword);
            }

            foreach (var keywordValue in keywords)
            {
                var chiefComplaintRelatedKeyword = new ChiefComplaintRelatedKeyword
                {
                    ChiefComplaintId = id
                };

                var keyword = await _chiefComplaintKeywordRepository.GetAll()
                    .FirstOrDefaultAsync(k => k.Value == keywordValue);

                if (keyword == null)
                {
                    var newChiefComplaintKeyword =
                        new ChiefComplaintKeyword { Value = keywordValue };

                    _chiefComplaintKeywordRepository.Add(newChiefComplaintKeyword);
                    await _chiefComplaintKeywordRepository.SaveChangesAsync();

                    chiefComplaintRelatedKeyword.KeywordId = newChiefComplaintKeyword.Id;
                }

                else
                {
                    chiefComplaintRelatedKeyword.KeywordId = keyword.Id;
                }

                _chiefComplaintRelatedKeywordRepository.Add(chiefComplaintRelatedKeyword);
            }

            await _chiefComplaintRelatedKeywordRepository.SaveChangesAsync();
        }

        public async Task<IEnumerable<ChiefComplaintKeywordViewModel>> GetChiefComplaintKeywords(Guid id)
        {
            var keywords = await Repository.GetAll()
                .Include(c => c.ChiefComplaintsKeywords)
                .Where(c => c.Id == id)
                .SelectMany(c => c.ChiefComplaintsKeywords)
                .Select(c => c.Keyword)
                .ProjectTo<ChiefComplaintKeywordViewModel>()
                .ToListAsync();

            return keywords;
        }

        public async Task<IEnumerable<TemplateVm>> GetChiefComplaintTemplatesByType(Guid id, Guid templateTypeId)
        {
            var templates = await Repository.GetAll()
                .Where(cc => cc.Id == id)
                .Include(c => c.ChiefComplaintTemplates)
                .SelectMany(c => c.ChiefComplaintTemplates)
                .Select(ct => ct.Template)
                .Where(t => t.TemplateTypeId == templateTypeId)
                .ProjectTo<TemplateVm>()
                .ToListAsync();

            return templates;
        }

        public async Task<IQueryable<ChiefComplaintTemplateKeywordViewModel>> GetChiefComplaintTemplatesKeywords(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<ChiefComplaintTemplateKeywordViewModel>()
                .AsQueryable();

            var hpiTemplateTypes = await _templateTypeService
                .GetByFilter(new TemplateTypeSearchFilterVm
                {
                    Name = LibraryEntityNames.LibraryTemplateType.Hpi,
                    CompanyId = companyId
                });
            
            var hpiTemplateTypeId = hpiTemplateTypes.First().Id;

            var rosTemplateTypes = await _templateTypeService
                .GetByFilter(new TemplateTypeSearchFilterVm
                {
                    Name = LibraryEntityNames.LibraryTemplateType.Ros,
                    CompanyId = companyId
                });
            
            var rosTemplateTypeId = rosTemplateTypes.First().Id;

            var peTemplateTypes = await _templateTypeService
                .GetByFilter(new TemplateTypeSearchFilterVm
                {
                    Name = LibraryEntityNames.LibraryTemplateType.PhysicalExam,
                    CompanyId = companyId
                });
            
            var peTemplateTypeId = peTemplateTypes.First().Id;

            const string templatesSeparator = ", ";

            return Repository.GetAll()
                .Where(c => c.CompanyId == companyId)
                .Include(c => c.ChiefComplaintTemplates)
                .Include(c => c.ChiefComplaintsKeywords)
                .Select(c => new ChiefComplaintTemplateKeywordViewModel
                {
                    Id = c.Id,
                    Title = c.Title,
                    HpiTemplates = c.ChiefComplaintTemplates
                        .Where(t => t.Template.TemplateTypeId == hpiTemplateTypeId)
                        .Select(t => t.Template.ReportTitle)
                        .Join(templatesSeparator),
                    RosTemplates = c.ChiefComplaintTemplates
                        .Where(t => t.Template.TemplateTypeId == rosTemplateTypeId)
                        .Select(t => t.Template.ReportTitle)
                        .Join(templatesSeparator),
                    PhysicalExamTemplates = c.ChiefComplaintTemplates
                        .Where(t => t.Template.TemplateTypeId == peTemplateTypeId)
                        .Select(t => t.Template.ReportTitle)
                        .Join(templatesSeparator),
                    Keywords = c.ChiefComplaintsKeywords.Select(k => k.Keyword.Value)
                    .Join(templatesSeparator)
                });
        }

        public async Task AddKeywords(AddKeywordsViewModel addKeywordsViewModel)
        {
            var chiefComplaintId = addKeywordsViewModel.ChiefComplaintId;
            var keywords = addKeywordsViewModel.Keywords;

            foreach (var keywordValue in keywords)
            {
                var chiefComplaintRelatedKeyword = new ChiefComplaintRelatedKeyword
                {
                    ChiefComplaintId = chiefComplaintId
                };

                var keyword = await _chiefComplaintKeywordRepository.GetAll()
                    .FirstOrDefaultAsync(k => k.Value == keywordValue);

                if (keyword == null)
                {
                    var newChiefComplaintKeyword =
                        new ChiefComplaintKeyword { Value = keywordValue };

                    _chiefComplaintKeywordRepository.Add(newChiefComplaintKeyword);
                    await _chiefComplaintKeywordRepository.SaveChangesAsync();

                    chiefComplaintRelatedKeyword.KeywordId = newChiefComplaintKeyword.Id;
                }

                else
                {
                    chiefComplaintRelatedKeyword.KeywordId = keyword.Id;
                }

                _chiefComplaintRelatedKeywordRepository.Add(chiefComplaintRelatedKeyword);
            }

            await _chiefComplaintRelatedKeywordRepository.SaveChangesAsync();
        }

        public async Task<IEnumerable<ChiefComplaintWithKeywordsViewModel>> GetChiefComplaintWithKeywords(Guid companyId)
        {
            var chiefComplaints = await _chiefComplaintRepository
                .GetAll()
                .Include(ck => ck.ChiefComplaintsKeywords)
                .Where(ck => ck.CompanyId == companyId)
                .ProjectTo<ChiefComplaintWithKeywordsViewModel>()
                .ToListAsync();

            return chiefComplaints;
        }

        public IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<LookupViewModel>()
                    .AsQueryable();

            return Repository.GetAll().Where(c => c.CompanyId == companyId)
                .ProjectTo<LookupViewModel>();
        }
    }
}