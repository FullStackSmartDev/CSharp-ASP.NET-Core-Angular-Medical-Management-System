using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.SelectableItemsManagement;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class PhraseService : BaseDeletableByIdService<Phrase, PhraseViewModel>, IPhraseService
    {
        private readonly ISelectableItemsService _selectableItemsService;

        public PhraseService(IPhraseRepository repository,
            IMapper mapper,
            ISelectableItemsService selectableItemsService)
            : base(repository, mapper)
        {
            _selectableItemsService = selectableItemsService;
        }

        public override async Task<PhraseViewModel> GetById(Guid id)
        {
            var phrase = await Repository.GetAll()
                .FirstOrDefaultAsync(t => t.Id == id);

            var phraseVm = Mapper.Map<PhraseViewModel>(phrase);

            var phraseContent = phraseVm.Content;

            if (!string.IsNullOrEmpty(phraseContent))
            {
                phraseVm.ContentWithDefaultSelectableItemsValues = _selectableItemsService
                    .SetInitialValues(phraseContent);
            }

            return phraseVm;
        }

        public IQueryable<PhraseViewModel> GetAll()
        {
            return Repository.GetAll()
                .ProjectTo<PhraseViewModel>();
        }

        public async Task<PhraseViewModel> GetByName(string name, Guid companyId)
        {
            var phrase = await Repository.GetAll()
                .FirstOrDefaultAsync(p => p.Name == name && p.CompanyId == companyId);

            return phrase == null
                ? null
                : Mapper.Map<PhraseViewModel>(phrase);
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<LookupViewModel>().AsQueryable();

            return Repository.GetAll()
                .Where(p => p.CompanyId == companyId && p.IsActive)
                .ProjectTo<LookupViewModel>();
        }

        public IQueryable<PhraseViewModel> Grid(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<PhraseViewModel>().AsQueryable();

            return Repository.GetAll()
                .Where(p => p.CompanyId == companyId)
                .ProjectTo<PhraseViewModel>();
        }
    }
}