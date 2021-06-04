using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Medico.Api.Controllers
{
    [Authorize]
    [Route("api/report")]
    public class ReportController : ApiController
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService,
            ICompanySecurityService companySecurityService) : base(companySecurityService)
        {
            _reportService = reportService;
        }

        [Authorize(Roles = "SuperAdmin,Physician")]
        [HttpPost]
        public FileResult PdfReport([FromBody]ReportViewModel reportViewModel)
        {
            var report = _reportService
                .GenerateFromHtmlString(reportViewModel.ReportContent);

            FileResult fileResult = new FileContentResult(report, "application/pdf")
            {
                FileDownloadName = "report.pdf"
            };

            return fileResult;
        }
    }
}
