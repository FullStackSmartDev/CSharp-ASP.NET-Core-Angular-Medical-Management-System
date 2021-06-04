using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.Services.PatientChart;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/defaultvalue")]
    public class DefaultValueController : ControllerBase
    {
        private readonly IDefaultValueService _defaultValueService;

        public DefaultValueController(IDefaultValueService defaultValueService)
        {
            _defaultValueService = defaultValueService;
        }

        [Route("key/{patientChartNodeType}")]
        public Task<DefaultValueViewModel> GetByKyeName(PatientChartNodeType patientChartNodeType)
        {
            return _defaultValueService.GetPatientChartNodeType(patientChartNodeType);
        }
    }
}
