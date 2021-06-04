using System.Linq;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Application.Services
{
    public class MedicationsUpdateItemService
        : BaseDeletableByIdService<MedicationsUpdateItem, MedicationsUpdateItemViewModel>, IMedicationsUpdateItemService
    {
        public MedicationsUpdateItemService(IMedicationsUpdateItemRepository repository,
            IMapper mapper) : base(repository, mapper)
        {
        }

        public IQueryable<MedicationsUpdateItemViewModel> GetAll()
        {
            return Repository.GetAll()
                .ProjectTo<MedicationsUpdateItemViewModel>();
        }
    }
}
