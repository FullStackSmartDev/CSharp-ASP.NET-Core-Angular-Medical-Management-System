using System.Linq;
using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Medico.Data.Repository
{
    public class ViewRepository<TEntity>
        : IViewRepository<TEntity> where TEntity : class
    {
        protected readonly DbQuery<TEntity> DbQuery;

        public ViewRepository(MedicoContext context)
        {
            DbQuery = context.Query<TEntity>();
        }

        public IQueryable<TEntity> GetAll()
        {
            return DbQuery.AsQueryable();
        }
    }
}