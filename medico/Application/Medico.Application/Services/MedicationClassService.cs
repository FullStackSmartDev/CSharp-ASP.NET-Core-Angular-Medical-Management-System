using System;
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
    public class MedicationClassService : IMedicationClassService
    {
        private readonly IMedicationClassRepository _medicationClassRepository;

        public MedicationClassService(IMedicationClassRepository medicationClassRepository)
        {
            _medicationClassRepository = medicationClassRepository;
        }

        public IQueryable<LookupViewModel> GetAllForLookup(DxOptionsViewModel loadOptions, int lookupItemsCount)
        {
            loadOptions.PrimaryKey = new[] { "Id" };
            loadOptions.PaginateViaPrimaryKey = true;

            var takeItemsCount = loadOptions.Take;
            loadOptions.Take = takeItemsCount != 0 ? takeItemsCount : lookupItemsCount;

            return _medicationClassRepository.GetAll().ProjectTo<LookupViewModel>();
        }

        public async Task<LookupViewModel> GetById(Guid id)
        {
            var medicationClass = await _medicationClassRepository.GetAll()
                .FirstOrDefaultAsync(a => a.Id == id);

            return medicationClass == null
                ? null
                : Mapper.Map<LookupViewModel>(medicationClass);
        }
    }
}
