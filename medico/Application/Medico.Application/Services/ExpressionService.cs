using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.Expression;
using Medico.Data.Repository;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Expression = Medico.Domain.Models.Expression;

namespace Medico.Application.Services
{
    public class ExpressionService : BaseDeletableByIdService<Expression, ExpressionVm>,
        IExpressionService
    {
        private readonly IExpressionReferenceTableRepository _expressionReferenceTableRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IReferenceTableService _referenceTableService;

        public ExpressionService(IExpressionRepository repository,
            IMapper mapper,
            IExpressionReferenceTableRepository expressionReferenceTableRepository,
            IUnitOfWork unitOfWork,
            IReferenceTableService referenceTableService)
            : base(repository, mapper)
        {
            _expressionReferenceTableRepository = expressionReferenceTableRepository;
            _unitOfWork = unitOfWork;
            _referenceTableService = referenceTableService;
        }

        public async Task<List<ExpressionVm>> GetAll(Expression<Func<ExpressionVm, bool>> predicate)
        {
            var expressions = await Repository.GetAll()
                .Include(e => e.ExpressionReferenceTables)
                .ProjectTo<ExpressionVm>()
                .Where(predicate)
                .ToListAsync();

            return expressions;
        }

        public async Task<CreateUpdateExpressionVm> Create(CreateUpdateExpressionVm expressionVm)
        {
            var expression = Mapper.Map<Expression>(expressionVm);
            var referenceTableIds = expressionVm.ReferenceTables;

            if (referenceTableIds != null && referenceTableIds.Any())
            {
                expression.ExpressionReferenceTables = new List<ExpressionReferenceTable>();

                foreach (var referenceTable in referenceTableIds)
                {
                    expression.ExpressionReferenceTables.Add(new ExpressionReferenceTable
                        {ReferenceTableId = referenceTable});
                }
            }

            Repository.Add(expression);
            await Repository.SaveChangesAsync();

            expressionVm.Id = expression.Id;

            return expressionVm;
        }

        public async Task<CreateUpdateExpressionVm> Update(CreateUpdateExpressionVm expressionVm)
        {
            var expressionId = expressionVm.Id;

            var expression = await Repository.GetAll()
                .Include(e => e.ExpressionReferenceTables)
                .FirstOrDefaultAsync(e => e.Id == expressionId);

            if (expression == null)
                throw new InvalidOperationException("The expression cannot be found");

            Mapper.Map(expressionVm, expression);

            if (expression.ExpressionReferenceTables == null)
                expression.ExpressionReferenceTables = new List<ExpressionReferenceTable>();

            var referenceTableIds = expressionVm.ReferenceTables;
            var existingReferenceTables = expression.ExpressionReferenceTables;

            UpdateExpressionReferenceTables(existingReferenceTables, referenceTableIds, expressionId);

            Repository.Update(expression);
            await Repository.SaveChangesAsync();

            return expressionVm;
        }

        public async Task Delete(Guid id)
        {
            var expression = await Repository.GetAll()
                .Include(e => e.ExpressionReferenceTables)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (expression == null)
                throw new InvalidOperationException("The expression cannot be found");

            var expressionReferenceTables = expression.ExpressionReferenceTables;
            var isReferenceTableListEmpty = expressionReferenceTables == null || !expressionReferenceTables.Any();

            if (!isReferenceTableListEmpty)
            {
                var expressionReferenceTableRepository =
                    (Repository<ExpressionReferenceTable>) _expressionReferenceTableRepository;

                foreach (var expressionReferenceTable in expressionReferenceTables)
                {
                    expressionReferenceTableRepository.Remove(expressionReferenceTable);
                }
            }

            var libraryRelatedExpressions = await Repository.GetAll()
                .Where(e => e.LibraryExpressionId != null && e.LibraryExpressionId == id)
                .ToListAsync();

            if (libraryRelatedExpressions.Any())
                libraryRelatedExpressions.ForEach(t =>
                {
                    t.LibraryExpressionId = null;
                    t.Version = null;
                });

            ((Repository<Expression>) Repository).Remove(expression);

            await _unitOfWork.Commit();
        }

        public IQueryable<ExpressionGridItemVm> Grid(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<ExpressionGridItemVm>()
                    .AsQueryable();

            return Repository.GetAll().Where(l => l.CompanyId == companyId)
                .ProjectTo<ExpressionGridItemVm>();
        }

        public IQueryable<LookupViewModel> Lookup(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<LookupViewModel>()
                    .AsQueryable();

            return Repository.GetAll().Where(l => l.CompanyId == companyId)
                .ProjectTo<LookupViewModel>();
        }

        public IQueryable<ExpressionGridItemVm> LibraryGrid(DxOptionsViewModel loadOptions)
        {
            return Repository.GetAll().Where(t => t.CompanyId == null)
                .ProjectTo<ExpressionGridItemVm>();
        }

        public IQueryable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions)
        {
            return Repository.GetAll().Where(t => t.CompanyId == null)
                .ProjectTo<LookupViewModel>();
        }

        public async Task<IList<LookupViewModel>> GetReferenceTables(Guid expressionId)
        {
            return await Repository.GetAll()
                .Where(e => e.Id == expressionId)
                .Include(e => e.ExpressionReferenceTables)
                .ThenInclude(ert => ert.ReferenceTable)
                .SelectMany(e => e.ExpressionReferenceTables.Select(ert => ert.ReferenceTable))
                .ProjectTo<LookupViewModel>()
                .ToListAsync();
        }

        public Task<List<ExpressionGridItemVm>> GetByFilter(ImportedItemsSearchFilterVm searchFilter)
        {
            var query = Repository.GetAll();

            var excludeImported = searchFilter.ExcludeImported;
            if (excludeImported.HasValue)
                return GetExpressionsNotImportedToCompany(searchFilter.CompanyId);

            var companyId = searchFilter.CompanyId;
            query = query.Where(tt => tt.CompanyId == companyId);

            if (searchFilter.Take != 0)
                query = query.Take(searchFilter.Take);

            return query
                .ProjectTo<ExpressionGridItemVm>()
                .ToListAsync();
        }

        public async Task SyncWithLibraryExpression(Guid id)
        {
            var expression = await Repository.GetAll()
                .Include(t => t.LibraryExpression)
                .Include(t => t.ExpressionReferenceTables)
                .Include(t => t.LibraryExpression.ExpressionReferenceTables)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (expression == null)
                return;

            var libraryExpression = expression.LibraryExpression;

            if (libraryExpression == null)
                throw new ArgumentNullException(nameof(libraryExpression));

            var companyId = expression.CompanyId;
            if (companyId == null)
                throw new ArgumentNullException(nameof(companyId));

            var referenceTableIdsUsedInLibraryExpression =
                expression.LibraryExpression.ExpressionReferenceTables
                    .Select(l => l.ReferenceTableId)
                    .ToList();

            var referenceTableMap = await _referenceTableService
                .ImportFromLibrary(referenceTableIdsUsedInLibraryExpression, companyId.Value);

            expression.Template = libraryExpression.Template;
            expression.Version = libraryExpression.Version;

            expression.ExpressionReferenceTables
                .RemoveAll(l => true);

            foreach (var keyValuePair in referenceTableMap)
            {
                expression.ExpressionReferenceTables.Add(new ExpressionReferenceTable
                {
                    ExpressionId = expression.Id,
                    ReferenceTableId = keyValuePair.Value
                });
            }

            await _unitOfWork.Commit();
        }

        public async Task<IDictionary<Guid, Guid>> ImportFromLibrary(IList<Guid> libraryExpressionIds, Guid companyId,
            bool commitChanges = false)
        {
            var libraryWithAlreadyImportedExpressions = await Repository.GetAll()
                .Include(e => e.ExpressionReferenceTables)
                .Where(e => e.CompanyId == null && libraryExpressionIds.Contains(e.Id) ||
                            e.CompanyId == companyId && e.LibraryExpressionId != null
                                                     && libraryExpressionIds.Contains(e.LibraryExpressionId.Value))
                .ToListAsync();

            var libraryImportedExpressionMap =
                libraryWithAlreadyImportedExpressions
                    .Where(e => e.CompanyId == companyId && e.LibraryExpressionId != null)
                    .Select(e => new {LibraryExpressionId = e.LibraryExpressionId.Value, CompanyExpressionId = e.Id})
                    .ToDictionary(e => e.LibraryExpressionId, e => e.CompanyExpressionId);

            var libraryExpressions =
                libraryWithAlreadyImportedExpressions
                    .Where(c => c.CompanyId == null)
                    .ToList();

            var libraryImportedExpressionIds = libraryImportedExpressionMap.Keys;

            var newLibraryExpressionsImport = libraryExpressions
                .Where(c => !libraryImportedExpressionIds.Contains(c.Id))
                .ToList();

            if (!newLibraryExpressionsImport.Any())
                return libraryImportedExpressionMap;

            foreach (var newLibraryExpression in newLibraryExpressionsImport)
            {
                var libraryReferenceTableIds = newLibraryExpression.ExpressionReferenceTables
                    .Select(st => st.ReferenceTableId)
                    .ToList();

                var referenceTablesMap = await _referenceTableService
                    .ImportFromLibrary(libraryReferenceTableIds, companyId);

                var newExpressionId = Guid.NewGuid();
                var newTemplate = new Expression
                {
                    Id = newExpressionId,
                    CompanyId = companyId,
                    Title = newLibraryExpression.Title,
                    Version = newLibraryExpression.Version,
                    Template = newLibraryExpression.Template,
                    LibraryExpressionId = newLibraryExpression.Id
                };

                foreach (var referenceTableMap in referenceTablesMap)
                {
                    _expressionReferenceTableRepository.Add(new ExpressionReferenceTable
                    {
                        ExpressionId = newExpressionId,
                        ReferenceTableId = referenceTableMap.Value
                    });
                }

                libraryImportedExpressionMap.Add(newLibraryExpression.Id, newExpressionId);
                Repository.Add(newTemplate);
            }

            if (commitChanges)
                await _unitOfWork.Commit();

            return libraryImportedExpressionMap;
        }

        private static void UpdateExpressionReferenceTables(
            ICollection<ExpressionReferenceTable> existingReferenceTables,
            IList<Guid> newReferenceTableIds, Guid expressionId)
        {
            existingReferenceTables.Clear();

            var isNewReferenceTableListEmpty =
                newReferenceTableIds == null || !newReferenceTableIds.Any();

            if (isNewReferenceTableListEmpty)
                return;

            foreach (var newReferenceTableId in newReferenceTableIds)
            {
                existingReferenceTables.Add(new ExpressionReferenceTable
                {
                    ReferenceTableId = newReferenceTableId,
                    ExpressionId = expressionId
                });
            }
        }

        private async Task<List<ExpressionGridItemVm>> GetExpressionsNotImportedToCompany(Guid? companyId)
        {
            if (companyId == null)
                throw new ArgumentNullException();

            var libraryExpressionsQuery =
                Repository.GetAll()
                    .Where(t => t.CompanyId == null)
                    .ProjectTo<ExpressionGridItemVm>();

            var companyImportedExpressionIdsQuery = Repository.GetAll()
                .Where(t => t.CompanyId == companyId && t.LibraryExpressionId.HasValue)
                .Select(t => t.LibraryExpressionId.Value);

            var expressionMaps = await libraryExpressionsQuery
                .GroupJoin(companyImportedExpressionIdsQuery,
                    libraryExpression => libraryExpression.Id,
                    companyImportedExpressionId => companyImportedExpressionId,
                    (libraryExpression, companyImportedExpressionId) => new
                        {libraryExpression, companyImportedExpressionId})
                .SelectMany(
                    map => map.companyImportedExpressionId.DefaultIfEmpty(),
                    (map, companyImportedExpressionId) => new {map.libraryExpression, companyImportedExpressionId})
                .ToListAsync();

            return expressionMaps.Where(map => map.companyImportedExpressionId == Guid.Empty)
                .Select(x => x.libraryExpression)
                .ToList();
        }
    }
}