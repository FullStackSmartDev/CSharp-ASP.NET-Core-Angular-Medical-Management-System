using System.Linq;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface ILocationRoomService
    {
        IQueryable<LocationRoomViewModel> GetAll();
    }
}