using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Medico.Application.Interfaces;
using Medico.Application.MedicationsUpdate;
using Medico.Application.Queues;
using Medico.Application.ViewModels;
using Medico.Domain.Enums;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.MedicationsUpdate
{
    public class ScheduleMedicationsUpdateService : IScheduleMedicationsUpdateService
    {
        private readonly IMedicationsUpdateItemService _medicationsUpdateItemService;
        private readonly MedicationsUpdateTaskQueue _medicationsUpdateTaskQueue;
        private readonly INdcCodeRepository _ndcCodeRepository;
        private readonly MedicationsProvider _medicationsProvider;
        private readonly IMedicationNameRepository _medicationNameRepository;
        private readonly IMedicationClassRepository _medicationClassRepository;
        private readonly IMedicationClassMedicationNameRepository _medicationClassMedicationNameRepository;
        private readonly IMedicationItemInfoRepository _medicationItemInfoRepository;
        private readonly IMapper _mapper;

        private readonly List<MedicationName> _medicationNamesCache;
        private readonly List<MedicationClass> _medicationClassCache;

        public ScheduleMedicationsUpdateService(IMedicationsUpdateItemService medicationsUpdateItemService,
            MedicationsUpdateTaskQueue medicationsUpdateTaskQueue,
            INdcCodeRepository ndcCodeRepository,
            MedicationsProvider medicationsProvider,
            IMedicationNameRepository medicationNameRepository,
            IMedicationClassRepository medicationClassRepository,
            IMedicationClassMedicationNameRepository medicationClassMedicationNameRepository,
            IMedicationItemInfoRepository medicationItemInfoRepository,
            IMapper mapper)
        {
            _medicationsUpdateItemService = medicationsUpdateItemService;
            _medicationsUpdateTaskQueue = medicationsUpdateTaskQueue;
            _ndcCodeRepository = ndcCodeRepository;
            _medicationsProvider = medicationsProvider;
            _medicationNameRepository = medicationNameRepository;
            _medicationClassRepository = medicationClassRepository;
            _medicationClassMedicationNameRepository = medicationClassMedicationNameRepository;
            _medicationItemInfoRepository = medicationItemInfoRepository;
            _mapper = mapper;

            _medicationNamesCache = new List<MedicationName>();
            _medicationClassCache = new List<MedicationClass>();
        }

        public async Task ScheduleMedicationsUpdate(MedicationsUpdateItemViewModel medicationUpdateViewModel)
        {
            await _medicationsUpdateItemService.Create(medicationUpdateViewModel);

            _medicationsUpdateTaskQueue
                .QueueMedicationsUpdateItem(medicationUpdateViewModel);
        }

        public async Task<OperationResult<IEnumerable<MedicationItemInfoViewModel>>> RunMedicationsUpdate(MedicationsUpdateItemViewModel medicationUpdateViewModel)
        {
            try
            {
                medicationUpdateViewModel.Status = MedicationUpdateStatus.Running;
                await _medicationsUpdateItemService.Update(medicationUpdateViewModel);

                var ndcCodes = await _ndcCodeRepository.GetAll()
                    .Select(ndcCode => ndcCode.Code).ToListAsync();

                var filePath = medicationUpdateViewModel.MedicationsFilePath;
                var medicationsFromFile = _medicationsProvider.GetMedicationsFromFile(filePath);

                var newMedications = medicationsFromFile.Where(m => !ndcCodes.Contains(m.NdcCode))
                    .ToList();

                var newMedicationNames = newMedications.Select(m => m.MedicationName).Distinct();
                await CreateNewMedicationNames(newMedicationNames);

                var newClassNamesStrings = newMedications.Select(m => m.Classes);
                await CreateNewMedicationClasses(newClassNamesStrings);

                //distinct collection of combinations [medication class --- medication]
                var medicationClasses = newMedications
                    .SelectMany(m => GetMedicationClassNames(m.Classes).Select(c => new MedicationPerClass
                    { Class = c.ToUpperInvariant(), MedicationName = m.MedicationName.ToUpperInvariant() }))
                    .GroupBy(mpc => new { mpc.MedicationName, mpc.Class })
                    .Select(g => g.First());

                await CreateNewRelationshipBetweenClassesAndMedications(medicationClasses);
                return await CreateMedicationItems(newMedications);
            }
            catch (Exception e)
            {
                return OperationResult<IEnumerable<MedicationItemInfoViewModel>>.CreateErrorResult(e.Message);
            }
        }

        private async Task<OperationResult<IEnumerable<MedicationItemInfoViewModel>>> CreateMedicationItems(IEnumerable<NdcMedicationViewModel> medications)
        {
            var isSaveChangesRequired = false;
            var newlyCreatedMedicationItems = new List<MedicationItemInfo>();

            foreach (var medication in medications)
            {
                var medicationNameInUpperCase = medication.MedicationName
                    .ToUpperInvariant();

                var medicationNameEntity = _medicationNamesCache
                    .FirstOrDefault(mn => mn.Name == medicationNameInUpperCase);

                if (medicationNameEntity == null)
                    throw new InvalidOperationException(
                        $"Unable to get medications from cache with name: {medicationNameInUpperCase}");

                var unitList = medication.Unit.Split(";").Select(u => u.Trim()).ToArray();
                var strengthList = medication.Strength.Split(";").Select(u => u.Trim()).ToArray();

                if (unitList.All(s => s == "/"))
                    unitList = new[] { "" };

                if (unitList.Length != strengthList.Length)
                    throw new InvalidOperationException("Error. During parsing medications excel file. The number of units and strength is not the same");

                for (var i = 0; i < unitList.Length; i++)
                {
                    var unit = unitList[i];
                    var strength = strengthList[i];

                    var dbExistedMedicationItemInfo = await _medicationItemInfoRepository.GetAll()
                        .FirstOrDefaultAsync(m =>
                            m.Route == medication.Route && m.DosageForm == medication.DosageForm &&
                            m.MedicationNameId == medicationNameEntity.Id && m.Strength == strength &&
                            m.Unit == unit);

                    if (dbExistedMedicationItemInfo != null)
                        continue;

                    var existedMedicationItemInfo = newlyCreatedMedicationItems
                        .FirstOrDefault(m =>
                            m.Route == medication.Route && m.DosageForm == medication.DosageForm &&
                            m.MedicationNameId == medicationNameEntity.Id && m.Strength == strength &&
                            m.Unit == unit);

                    if (existedMedicationItemInfo != null)
                        continue;

                    var medicationItemInfo = new MedicationItemInfo
                    {
                        MedicationNameId = medicationNameEntity.Id,
                        DosageForm = medication.DosageForm,
                        Route = medication.Route,
                        Strength = strength,
                        Unit = unit
                    };

                    _medicationItemInfoRepository.Add(medicationItemInfo);
                    newlyCreatedMedicationItems.Add(medicationItemInfo);

                    if (!isSaveChangesRequired)
                        isSaveChangesRequired = true;
                }
            }

            var ids = newlyCreatedMedicationItems.Select(m => m.MedicationNameId.ToString());

            if (isSaveChangesRequired)
                await _medicationItemInfoRepository.SaveChangesAsync();

            var newlyCreatedMedicationItemViewModels =
                newlyCreatedMedicationItems.Select(_mapper.Map<MedicationItemInfoViewModel>);

            return OperationResult<IEnumerable<MedicationItemInfoViewModel>>
                .CreateSuccessResult(newlyCreatedMedicationItemViewModels);
        }

        private async Task CreateNewMedicationNames(IEnumerable<string> medicationNames)
        {
            var isSaveChangesRequired = false;

            foreach (var medicationName in medicationNames)
            {
                var medicationNameInUpperCase = medicationName.ToUpperInvariant();

                var medicationNameEntity = await _medicationNameRepository.GetAll()
                    .FirstOrDefaultAsync(mn => mn.Name == medicationNameInUpperCase);

                if (medicationNameEntity != null)
                {
                    _medicationNamesCache.Add(medicationNameEntity);
                    continue;
                }

                var newMedicationNameEntity = new MedicationName { Name = medicationNameInUpperCase };
                _medicationNameRepository.Add(newMedicationNameEntity);
                _medicationNamesCache.Add(newMedicationNameEntity);

                if (!isSaveChangesRequired)
                    isSaveChangesRequired = true;
            }

            if (isSaveChangesRequired)
                await _medicationNameRepository.SaveChangesAsync();
        }

        private async Task CreateNewMedicationClasses(IEnumerable<string> medicationClassNameStrings)
        {
            var isSaveChangesRequired = false;

            var medicationClassNames = GetAllMedicationClassNames(medicationClassNameStrings);

            foreach (var medicationClassName in medicationClassNames)
            {
                var medicationClass = await _medicationClassRepository.GetAll()
                    .FirstOrDefaultAsync(c => c.ClassName == medicationClassName);

                if (medicationClass != null)
                {
                    _medicationClassCache.Add(medicationClass);
                    continue;
                }

                var newMedicationClassEntity = new MedicationClass { ClassName = medicationClassName };
                _medicationClassRepository.Add(newMedicationClassEntity);
                _medicationClassCache.Add(newMedicationClassEntity);

                if (!isSaveChangesRequired)
                    isSaveChangesRequired = true;
            }

            if (isSaveChangesRequired)
                await _medicationClassRepository.SaveChangesAsync();
        }

        private async Task CreateNewRelationshipBetweenClassesAndMedications(IEnumerable<MedicationPerClass> medicationPerClassItems)
        {
            var isSaveChangesRequired = false;

            foreach (var medicationPerClass in medicationPerClassItems)
            {
                var medicationNameEntity = _medicationNamesCache
                    .FirstOrDefault(mn => mn.Name == medicationPerClass.MedicationName);

                if (medicationNameEntity == null)
                    throw new InvalidOperationException($"Unable to get medications from cache with name: {medicationPerClass.MedicationName}");

                var medicationClassEntity = _medicationClassCache
                    .FirstOrDefault(mn => mn.ClassName == medicationPerClass.Class);

                if (medicationClassEntity == null)
                    throw new InvalidOperationException($"Unable to get medication class from cache with name: {medicationPerClass.Class}");

                var medicationClassRelationship = await _medicationClassMedicationNameRepository.GetAll()
                    .FirstOrDefaultAsync(r =>
                        r.MedicationClassId == medicationClassEntity.Id &&
                        r.MedicationNameId == medicationNameEntity.Id);

                if (medicationClassRelationship != null)
                    continue;

                _medicationClassMedicationNameRepository.Add(new MedicationClassMedicationName
                {
                    MedicationClassId = medicationClassEntity.Id,
                    MedicationNameId = medicationNameEntity.Id
                });

                if (!isSaveChangesRequired)
                    isSaveChangesRequired = true;
            }

            if (isSaveChangesRequired)
                await _medicationClassMedicationNameRepository.SaveChangesAsync();
        }

        private static IEnumerable<string> GetMedicationClassNames(string medicationClassNameString)
        {
            return medicationClassNameString.Split(',')
                .Select(c => c.Trim().ToUpperInvariant())
                .Where(c => !string.IsNullOrEmpty(c))
                .Distinct();
        }

        private static IEnumerable<string> GetAllMedicationClassNames(IEnumerable<string> medicationClassNameStrings)
        {
            return medicationClassNameStrings
                .SelectMany(GetMedicationClassNames)
                .Where(c => !string.IsNullOrEmpty(c))
                .Distinct();
        }

        private class MedicationPerClass
        {
            public string MedicationName { get; set; }

            public string Class { get; set; }
        }

    }
}
