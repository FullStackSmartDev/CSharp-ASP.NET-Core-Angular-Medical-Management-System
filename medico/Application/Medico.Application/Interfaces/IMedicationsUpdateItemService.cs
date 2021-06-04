using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IMedicationsUpdateItemService
    {
        IQueryable<MedicationsUpdateItemViewModel> GetAll();

        Task<MedicationsUpdateItemViewModel> Create(MedicationsUpdateItemViewModel medicationsUpdateItem);

        Task<MedicationsUpdateItemViewModel> Update(MedicationsUpdateItemViewModel medicationsUpdateItem);
    }
}
