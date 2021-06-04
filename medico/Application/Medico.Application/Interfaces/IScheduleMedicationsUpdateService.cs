using System.Collections.Generic;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IScheduleMedicationsUpdateService
    {
        Task ScheduleMedicationsUpdate(MedicationsUpdateItemViewModel medicationUpdateViewModel);

        Task<OperationResult<IEnumerable<MedicationItemInfoViewModel>>> RunMedicationsUpdate(
            MedicationsUpdateItemViewModel medicationUpdateViewModel);
    }
}