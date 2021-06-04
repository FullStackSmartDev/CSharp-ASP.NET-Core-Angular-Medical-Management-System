using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace Medico.Application.Services
{
    public class MedicationService : IMedicationService
    {
        private readonly IMedicationRepository _medicationRepository;
        private readonly IMapper _mapper;
        private readonly IMedicationNameRepository _medicationNameRepository;
        private readonly IMedicationItemInfoViewRepository _medicationItemInfoViewRepository;
        private readonly IMedicationItemInfoRepository _medicationItemInfoRepository;

        public MedicationService(IMedicationRepository medicationRepository,
            IMapper mapper,
            IMedicationNameRepository medicationNameRepository,
            IMedicationItemInfoViewRepository medicationItemInfoViewRepository,
            IMedicationItemInfoRepository medicationItemInfoRepository)
        {
            _medicationRepository = medicationRepository;
            _mapper = mapper;
            _medicationNameRepository = medicationNameRepository;
            _medicationItemInfoViewRepository = medicationItemInfoViewRepository;
            _medicationItemInfoRepository = medicationItemInfoRepository;
        }

        public IQueryable<LookupViewModel> GetAll()
        {
            return _medicationRepository.GetAll()
                .ProjectTo<LookupViewModel>();
        }

        public IQueryable<LookupViewModel> GetAllForLookup(DxOptionsViewModel dxOptions, int lookupItemsCount)
        {
            dxOptions.PrimaryKey = new[] { "Id" };
            dxOptions.PaginateViaPrimaryKey = true;

            var takeItemsCount = dxOptions.Take;
            dxOptions.Take = takeItemsCount != 0 ? takeItemsCount : lookupItemsCount;

            var filters = dxOptions.Filter;

            if (filters == null)
                return GetAll();

            var filter = (JArray)filters[0];

            if (filter == null)
                return GetAll();

            var searchMedicationString = filter[2] == null
                ? string.Empty
                : ((JValue)filter[2]).Value.ToString();

            var isSearchMedicationStringExist = dxOptions.Filter != null && !string.IsNullOrEmpty(searchMedicationString);
            if (!isSearchMedicationStringExist)
                return GetAll();

            dxOptions.Filter = null;

            return _medicationRepository.GetAll()
                .Where(c => EF.Functions.Contains(c.NonProprietaryName, $"\"{searchMedicationString}\""))
                .ProjectTo<LookupViewModel>();
        }

        public IQueryable<LookupViewModel> GetMedicationNames(DxOptionsViewModel dxOptions, int lookupItemsCount)
        {
            dxOptions.PrimaryKey = new[] { "Id" };
            dxOptions.PaginateViaPrimaryKey = true;

            var takeItemsCount = dxOptions.Take;
            dxOptions.Take = takeItemsCount != 0 ? takeItemsCount : lookupItemsCount;

            var query = _medicationNameRepository.GetAll();

            var filters = dxOptions.Filter;

            if (filters == null)
                return query.ProjectTo<LookupViewModel>();

            var filter = filters[0] as JArray;

            if (filter == null)
            {
                var id = filters[0] as string;
                if (string.IsNullOrEmpty(id) || id.ToUpperInvariant() != "ID" || filters.Count != 2)
                    return query.ProjectTo<LookupViewModel>();

                var idValue = filters[1] as string;
                if (string.IsNullOrEmpty(idValue))
                    return query.ProjectTo<LookupViewModel>();

                var idGuid = Guid.Parse(idValue);
                return query.Where(mn => mn.Id == idGuid).ProjectTo<LookupViewModel>();
            }

            var searchMedicationString = filter[2] == null
                ? string.Empty
                : ((JValue)filter[2]).Value.ToString();

            var isSearchMedicationStringExist = dxOptions.Filter != null && !string.IsNullOrEmpty(searchMedicationString);
            if (!isSearchMedicationStringExist)
                return query.ProjectTo<LookupViewModel>();

            dxOptions.Filter = null;

            return query.Where(c => EF.Functions.Contains(c.Name, $"\"{searchMedicationString}\""))
                .ProjectTo<LookupViewModel>();
        }

        public async Task<LookupViewModel> GetById(Guid id)
        {
            var medication = await _medicationRepository
                .GetAll().FirstOrDefaultAsync(m => m.Id == id);

            return medication == null ? null : _mapper.Map<LookupViewModel>(medication);
        }

        public async Task<MedicationItemInfoViewModel> GetMedicationInfoByMedicationNameId(Guid medicationNameId)
        {
            var medication = await _medicationItemInfoViewRepository
                .GetAll()
                .FirstOrDefaultAsync(m => m.MedicationNameId == medicationNameId);

            return medication == null ? null : _mapper.Map<MedicationItemInfoViewModel>(medication);
        }

        public async Task<LookupViewModel> GetNameByMedicationNameId(Guid medicationNameId)
        {
            var medicationName = await _medicationNameRepository
                .GetAll()
                .FirstOrDefaultAsync(m => m.Id == medicationNameId);

            return medicationName == null
                ? null
                : _mapper.Map<LookupViewModel>(medicationName);
        }

        public async Task<MedicationConfigurationExistenceViewModel> GetMedicationConfigurationExistence(
            MedicationItemViewModel medicationItemViewModel)
        {
            var medicationItemInfo = await _medicationItemInfoRepository
                .GetAll()
                .FirstOrDefaultAsync(m => m.MedicationNameId == medicationItemViewModel.MedicationNameId &&
                                          m.Route == medicationItemViewModel.Route &&
                                          m.DosageForm == medicationItemViewModel.DosageForm &&
                                          m.Strength == medicationItemViewModel.Strength &&
                                          m.Unit == medicationItemViewModel.Unit);

            var medicationConfigurationExistenceViewModel = _mapper
                .Map<MedicationConfigurationExistenceViewModel>(medicationItemViewModel);

            medicationConfigurationExistenceViewModel.Exist = medicationItemInfo != null;

            return medicationConfigurationExistenceViewModel;
        }
    }
}
