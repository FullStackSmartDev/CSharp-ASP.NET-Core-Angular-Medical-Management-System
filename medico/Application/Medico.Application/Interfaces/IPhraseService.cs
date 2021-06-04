using System;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IPhraseService
    {
        IQueryable<PhraseViewModel> GetAll();

        Task<PhraseViewModel> GetById(Guid id);

        Task<PhraseViewModel> GetByName(string name, Guid companyId);

        Task<PhraseViewModel> Create(PhraseViewModel phraseViewModel);

        Task<PhraseViewModel> Update(PhraseViewModel phraseViewModel);

        Task Delete(Guid id);

        IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions);

        IQueryable<PhraseViewModel> Grid(CompanyDxOptionsViewModel loadOptions);
    }
}