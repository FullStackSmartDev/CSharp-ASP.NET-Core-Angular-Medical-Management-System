using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Medico.Data.Repository
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected readonly MedicoContext Db;
        protected readonly DbSet<TEntity> DbSet;

        public Repository(MedicoContext context)
        {
            Db = context;
            DbSet = Db.Set<TEntity>();
        }

        public virtual void Add(TEntity obj)
        {
            DbSet.AddAsync(obj);
        }

        public void AddRange(IEnumerable<TEntity> entities)
        {
            DbSet.AddRange(entities);
        }

        public virtual TEntity GetById(Guid id)
        {
            return DbSet.Find(id);
        }

        public virtual IQueryable<TEntity> GetAll()
        {
            return DbSet;
        }

        public virtual void Update(TEntity obj)
        {
            DbSet.Update(obj);
        }

        public virtual void Remove(Guid id)
        {
            DbSet.Remove(DbSet.Find(id));
        }

        public virtual void Remove(TEntity entity)
        {
            DbSet.Remove(entity);
        }

        public int SaveChanges()
        {
            return Db.SaveChanges();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await Db.SaveChangesAsync();
        }

        public void RemoveAll()
        {
            var tableName = typeof(TEntity).Name;
            Db.Database.ExecuteSqlCommand($"DELETE FROM {tableName}", tableName);
        }

        public void Dispose()
        {
            Db.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
