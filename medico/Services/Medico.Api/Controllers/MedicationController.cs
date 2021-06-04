using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Api.Constants;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/medication")]
    public class MedicationController : ControllerBase
    {
        private readonly IMedicationService _medicationService;

        public MedicationController(IMedicationService medicationService)
        {
            _medicationService = medicationService;
        }

        [HttpPost]
        [Route("configuration/existence")]
        public Task<MedicationConfigurationExistenceViewModel> GetMedicationConfigurationExistence(
            [FromBody]MedicationItemViewModel medicationItemViewModel)
        {
            return _medicationService.GetMedicationConfigurationExistence(medicationItemViewModel);
        }

        [Route("name/{medicationNameId}")]
        public Task<LookupViewModel> GetNameByMedicationNameId(Guid medicationNameId)
        {
            return _medicationService.GetNameByMedicationNameId(medicationNameId);
        }

        [Route("{id}")]
        public Task<LookupViewModel> Get(Guid id)
        {
            return _medicationService.GetById(id);
        }

        [Route("info/{medicationNameId}")]
        public Task<MedicationItemInfoViewModel> GetMedicationInfoByMedicationNameId(Guid medicationNameId)
        {
            return _medicationService.GetMedicationInfoByMedicationNameId(medicationNameId);
        }

        [Route("name/dx/lookup")]
        public object DxLookupMedicationNameData(DxOptionsViewModel loadOptions)
        {
            var query = _medicationService
                .GetMedicationNames(loadOptions, AppConstants.SearchConfiguration.LookupItemsCount);

            return DataSourceLoader.Load(query, loadOptions);
        }

        [Route("dx/lookup")]
        public object DxLookupData(DxOptionsViewModel loadOptions)
        {
            var query = _medicationService
                .GetAllForLookup(loadOptions, AppConstants.SearchConfiguration.LookupItemsCount);

            return DataSourceLoader.Load(query, loadOptions);
        }
    }
}