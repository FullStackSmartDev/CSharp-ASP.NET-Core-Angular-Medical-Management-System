using System;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IMedicationService
    {
        IQueryable<LookupViewModel> GetAll();

        IQueryable<LookupViewModel> GetAllForLookup(DxOptionsViewModel dxOptions, int lookupItemsCount);

        IQueryable<LookupViewModel> GetMedicationNames(DxOptionsViewModel dxOptions, int lookupItemsCount);

        Task<LookupViewModel> GetById(Guid id);

        Task<MedicationItemInfoViewModel> GetMedicationInfoByMedicationNameId(Guid medicationNameId);

        Task<LookupViewModel> GetNameByMedicationNameId(Guid medicationNameId);

        Task<MedicationConfigurationExistenceViewModel> GetMedicationConfigurationExistence(
            MedicationItemViewModel medicationItemViewModel);
    }
}