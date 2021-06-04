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
    [Route("api/medicationclass")]
    public class MedicationClassController : ControllerBase
    {
        private readonly IMedicationClassService _medicationClassService;

        public MedicationClassController(IMedicationClassService medicationClassService)
        {
            _medicationClassService = medicationClassService;
        }

        [Route("{id}")]
        public Task<LookupViewModel> Get(Guid id)
        {
            return _medicationClassService.GetById(id);
        }

        [Route("dx/lookup")]
        public object DxLookupData(DxOptionsViewModel loadOptions)
        {
            var query = _medicationClassService
                .GetAllForLookup(loadOptions, AppConstants.SearchConfiguration.LookupItemsCount);

            return DataSourceLoader.Load(query, loadOptions);
        }
    }
}
