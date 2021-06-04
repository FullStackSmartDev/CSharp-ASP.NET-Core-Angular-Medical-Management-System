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
    [Route("api/cptcode")]
    public class CptCodeController : ControllerBase
    {
        private readonly ICptCodeService _cptCodeService;

        public CptCodeController(ICptCodeService cptCodeService)
        {
            _cptCodeService = cptCodeService;
        }

        [Route("{id}")]
        public Task<CptCodeViewModel> Get(Guid id)
        {
            return _cptCodeService.GetById(id);
        }

        [Route("dx/lookup")]
        public object DxLookupData(DxOptionsViewModel dxOptions)
        {
            var query = _cptCodeService.GetAll();

            dxOptions.PrimaryKey = new[] { "Id" };
            dxOptions.PaginateViaPrimaryKey = true;

            var takeItemsCount = dxOptions.Take;
            dxOptions.Take = takeItemsCount != 0
                ? takeItemsCount
                : AppConstants.SearchConfiguration.LookupItemsCount;

            return DataSourceLoader.Load(query, dxOptions);
        }
    }
}
