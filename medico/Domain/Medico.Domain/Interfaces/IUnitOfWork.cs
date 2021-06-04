using System;
using System.Threading.Tasks;

namespace Medico.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        Task<bool> Commit();
    }
}
