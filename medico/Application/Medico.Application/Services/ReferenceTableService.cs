using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.ReferenceTable;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class ReferenceTableService : BaseDeletableByIdService<ReferenceTable, ReferenceTableVm>,
        IReferenceTableService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ReferenceTableService(IReferenceTableRepository repository,
            IMapper mapper,
            IUnitOfWork unitOfWork) : base(repository, mapper)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<ReferenceTableVm>> GetAll(Expression<Func<ReferenceTableVm, bool>> predicate)
        {
            var referenceTables = await Repository.GetAll()
                .ProjectTo<ReferenceTableVm>()
                .Where(predicate)
                .ToListAsync();

            return referenceTables;
        }

        public IQueryable<ReferenceTableGridItemVm> LibraryGrid(DxOptionsViewModel loadOptions)
        {
            return Repository.GetAll()
                .Where(t => t.CompanyId == null)
                .ProjectTo<ReferenceTableGridItemVm>();
        }

        public IQueryable<LookupViewModel> LibraryLookup(DxOptionsViewModel loadOptions)
        {
            return Repository.GetAll()
                .Where(t => t.CompanyId == null)
                .ProjectTo<LookupViewModel>();
        }

        public IQueryable<ReferenceTableGridItemVm> Grid(CompanyDxOptionsViewModel loadOptions)
        {
            var companyId = loadOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<ReferenceTableGridItemVm>()
                    .AsQueryable();

            return Repository.GetAll().Where(l => l.CompanyId == companyId)
                .ProjectTo<ReferenceTableGridItemVm>();
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

        public Task<List<ReferenceTableGridItemVm>> GetByFilter(ImportedItemsSearchFilterVm searchFilter)
        {
            var query = Repository.GetAll();

            var excludeImported = searchFilter.ExcludeImported;
            if (excludeImported.HasValue)
                return GetReferenceTablesNotImportedToCompany(searchFilter.CompanyId);

            var companyId = searchFilter.CompanyId;
            query = query.Where(tt => tt.CompanyId == companyId);

            if (searchFilter.Take != 0)
                query = query.Take(searchFilter.Take);

            return query
                .ProjectTo<ReferenceTableGridItemVm>()
                .ToListAsync();
        }

        public async Task<IDictionary<Guid, Guid>> ImportFromLibrary(IList<Guid> libraryReferenceTableIds,
            Guid companyId, bool commitChanges = false)
        {
            var libraryWithAlreadyImportedRefTables = await Repository.GetAll()
                .Where(t => t.CompanyId == null && libraryReferenceTableIds.Contains(t.Id) ||
                            t.CompanyId == companyId && t.LibraryReferenceTableId != null
                                                     && libraryReferenceTableIds.Contains(t.LibraryReferenceTableId
                                                         .Value))
                .ToListAsync();

            var libraryImportedRefTableMap =
                libraryWithAlreadyImportedRefTables
                    .Where(t => t.CompanyId == companyId && t.LibraryReferenceTableId != null)
                    .Select(t => new
                        {LibrarySelectableListId = t.LibraryReferenceTableId.Value, CompanySelectableListId = t.Id})
                    .ToDictionary(c => c.LibrarySelectableListId,
                        c => c.CompanySelectableListId);

            var libraryRefTables =
                libraryWithAlreadyImportedRefTables
                    .Where(t => t.CompanyId == null)
                    .ToList();

            var libraryImportedRefTableIds = libraryImportedRefTableMap.Keys;

            var newLibraryRefTableToImport = libraryRefTables
                .Where(t => !libraryImportedRefTableIds.Contains(t.Id))
                .ToList();

            if (!newLibraryRefTableToImport.Any())
                return libraryImportedRefTableMap;

            var newRefTables = new List<ReferenceTable>();

            foreach (var newLibraryRefTable in newLibraryRefTableToImport)
            {
                var newRefTableId = Guid.NewGuid();
                var newRefTable = new ReferenceTable
                {
                    Id = newRefTableId,
                    CompanyId = companyId,
                    LibraryReferenceTableId = newLibraryRefTable.Id,
                    Title = newLibraryRefTable.Title,
                    Version = newLibraryRefTable.Version,
                    Data = newLibraryRefTable.Data,
                };

                libraryImportedRefTableMap.Add(newLibraryRefTable.Id, newRefTableId);
                newRefTables.Add(newRefTable);
            }

            Repository.AddRange(newRefTables);

            if (commitChanges)
                await _unitOfWork.Commit();

            return libraryImportedRefTableMap;
        }

        public async Task SyncWithLibraryReferenceTable(Guid id)
        {
            var referenceTable = await Repository.GetAll()
                .Include(t => t.LibraryReferenceTable)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (referenceTable == null)
                return;

            var libraryReferenceTable = referenceTable.LibraryReferenceTable;

            if (libraryReferenceTable == null)
                throw new ArgumentNullException(nameof(libraryReferenceTable));

            referenceTable.Version = libraryReferenceTable.Version;
            referenceTable.Data = libraryReferenceTable.Data;

            await _unitOfWork.Commit();
        }

        private async Task<List<ReferenceTableGridItemVm>> GetReferenceTablesNotImportedToCompany(Guid? companyId)
        {
            if (companyId == null)
                throw new ArgumentNullException();

            var libraryRefTablesQuery =
                Repository.GetAll()
                    .Where(t => t.CompanyId == null)
                    .ProjectTo<ReferenceTableGridItemVm>();

            var companyImportedRefTableIdsQuery = Repository.GetAll()
                .Where(t => t.CompanyId == companyId && t.LibraryReferenceTableId.HasValue)
                .Select(t => t.LibraryReferenceTableId.Value);

            var referenceTableMaps = await libraryRefTablesQuery
                .GroupJoin(companyImportedRefTableIdsQuery,
                    libraryRefTable => libraryRefTable.Id,
                    companyImportedRefTableId => companyImportedRefTableId,
                    (libraryRefTable, companyImportedRefTableId) => new
                        {libraryRefTable, companyImportedRefTableId})
                .SelectMany(
                    map => map.companyImportedRefTableId.DefaultIfEmpty(),
                    (map, companyImportedRefTableId) => new {map.libraryRefTable, companyImportedRefTableId})
                .ToListAsync();

            return referenceTableMaps.Where(map => map.companyImportedRefTableId == Guid.Empty)
                .Select(x => x.libraryRefTable)
                .ToList();
        }
    }
}