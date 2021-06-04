using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class BaseService<TModel, TViewModel> where TModel : Entity where TViewModel : BaseViewModel
    {
        protected IRepository<TModel> Repository { get; }
        protected IMapper Mapper { get; }

        protected BaseService(IRepository<TModel> repository,
            IMapper mapper)
        {
            Repository = repository;
            Mapper = mapper;
        }

        public virtual async Task<TViewModel> Create(TViewModel viewModel)
        {
            var entity = Mapper.Map<TModel>(viewModel);
            Repository.Add(entity);
            await Repository.SaveChangesAsync();

            viewModel.Id = entity.Id;

            return viewModel;
        }

        public virtual async Task<TViewModel> Update(TViewModel viewModel)
        {
            var entity = Mapper.Map<TModel>(viewModel);
            Repository.Update(entity);
            await Repository.SaveChangesAsync();

            return viewModel;
        }

        public virtual async Task<TViewModel> GetById(Guid id)
        {
            var entity = await Repository.GetAll()
                .FirstOrDefaultAsync(a => a.Id == id);

            return entity == null
                ? null
                : Mapper.Map<TViewModel>(entity);
        }

        protected static IQueryable<TEntity> ApplyIntervalFilter<TEntity>(DateTime startDate,
            DateTime endDate, IQueryable<TEntity> query, out bool isIntervalFilterApplied) where TEntity : IIntervalEntity
        {

            if (startDate == default(DateTime) || endDate < startDate)
            {
                isIntervalFilterApplied = false;
                return query;
            }

            //devextreme scheduleduler returns end date is less than real on one minute.
            //For example '2019-12-11 14:59:00' instead of '2019-12-11 15:00:00'
            endDate = endDate.AddMinutes(1);
            query = query.Where(a => a.StartDate >= startDate && a.EndDate <= endDate);

            isIntervalFilterApplied = true;
            return query;
        }

    }

    public class BaseDeletableByIdService<TModel, TViewModel> : BaseService<TModel, TViewModel>
        where TModel : Entity
        where TViewModel : BaseViewModel
    {
        protected BaseDeletableByIdService(IDeletableByIdRepository<TModel> repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public Task DeleteById(Guid id)
        {
            var repository = (IDeletableByIdRepository<TModel>)Repository;
            repository.Remove(id);
            return repository.SaveChangesAsync();
        }
    }

    public class BaseDeletableByEntityService<TModel, TViewModel> : BaseService<TModel, TViewModel>
        where TModel : Entity
        where TViewModel : BaseViewModel
    {
        protected BaseDeletableByEntityService(IDeletableByEntityRepository<TModel> repository, IMapper mapper)
            : base(repository, mapper)
        {
        }

        public Task DeleteByEntity(TModel entity)
        {
            var repository = (IDeletableByEntityRepository<TModel>)Repository;
            repository.Remove(entity);
            return repository.SaveChangesAsync();
        }
    }
}
