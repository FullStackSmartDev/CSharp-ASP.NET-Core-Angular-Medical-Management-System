using System;
using System.Threading.Tasks;
using DevExtreme.AspNet.Data;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Medico.Api.Controllers
{
    [Authorize(Roles = "SuperAdmin")]
    [Route("api/medications-scheduled-item")]
    public class ScheduledMedicationsUpdateItemController : Controller
    {
        private readonly IOptions<MedicoSettingsViewModel> _medicoSettings;
        private readonly IFileService _fileService;
        private readonly IScheduleMedicationsUpdateService _scheduleMedicationsUpdateService;
        private readonly IMedicationsUpdateItemService _medicationsUpdateItemService;

        public ScheduledMedicationsUpdateItemController(IOptions<MedicoSettingsViewModel> medicoSettings,
            IFileService fileService,
            IScheduleMedicationsUpdateService scheduleMedicationsUpdateService,
            IMedicationsUpdateItemService medicationsUpdateItemService)
        {
            _medicoSettings = medicoSettings;
            _fileService = fileService;
            _scheduleMedicationsUpdateService = scheduleMedicationsUpdateService;
            _medicationsUpdateItemService = medicationsUpdateItemService;
        }

        [Route("download/medications/{fileName}")]
        public async Task<IActionResult> GetMedicationsExcelFile(string fileName)
        {
            var medicationsExcelFilesDirectory = _medicoSettings
                .Value.MedicationsExcelFilesUploadPath;

            var fileContent = await _fileService.Get(medicationsExcelFilesDirectory, fileName);

            return File(fileContent, "application/vnd.ms-excel", fileName);
        }

        [DisableRequestSizeLimit]
        [HttpPost]
        public async Task<IActionResult> Post([FromForm]IFormFile file)
        {
            var medicationsExcelFilesDirectory = _medicoSettings
                .Value.MedicationsExcelFilesUploadPath;

            var fileName = $"{DateTime.UtcNow:MM_dd_yyyy}_{file.FileName}";
            var fileInfo = await _fileService.Save(medicationsExcelFilesDirectory, file, fileName);

            var medicationUpdateViewModel = new MedicationsUpdateItemViewModel
            {
                Date = DateTime.UtcNow,
                MedicationsFileName = fileName,
                MedicationsFilePath = fileInfo.FilePath,
                Status = MedicationUpdateStatus.Scheduled
            };

            await _scheduleMedicationsUpdateService
                .ScheduleMedicationsUpdate(medicationUpdateViewModel);

            return Ok();
        }

        [Route("dx/grid")]
        public object DxGridData(DxOptionsViewModel dxOptionsViewModel)
        {
            dxOptionsViewModel.PrimaryKey = new[] { "Id" };
            dxOptionsViewModel.PaginateViaPrimaryKey = true;

            return DataSourceLoader.Load(_medicationsUpdateItemService.GetAll(),
                dxOptionsViewModel);
        }
    }
}
