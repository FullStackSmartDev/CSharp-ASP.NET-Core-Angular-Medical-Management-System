using System.Threading.Tasks;
using Medico.Data.Context;
using Medico.Domain.Interfaces;

namespace Medico.Data.UoW
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MedicoContext _context;

        public UnitOfWork(MedicoContext context)
        {
            _context = context;
        }

        public async Task<bool> Commit()
        {
            var changes = await _context.SaveChangesAsync();
            return changes > 0;
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
