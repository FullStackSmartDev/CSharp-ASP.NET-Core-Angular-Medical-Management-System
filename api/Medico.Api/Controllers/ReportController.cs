using System;
using Medico.Api.Dto;
using Microsoft.AspNetCore.Mvc;
using SelectPdf;

namespace Medico.Api.Controllers
{
    [Route("api/report")]
    public class ReportController : Controller
    {
        [HttpPost]
        public FileResult PdfReport([FromBody]ReportDto report)
        {
            var converter = new HtmlToPdf();

            converter.Options.MarginLeft = 15;
            converter.Options.MarginRight = 15;
            converter.Options.MarginBottom = 15;
            converter.Options.MarginTop = 15;

            var reportContent = report.ReportContent;
            if(string.IsNullOrEmpty(reportContent))
                throw new InvalidOperationException("Report content is empty");

            var doc = converter.ConvertHtmlString(reportContent);
            byte[] pdf = doc.Save();
            doc.Close();

            FileResult fileResult = new FileContentResult(pdf, "application/pdf")
            {
                FileDownloadName = "report.pdf"
            };
            return fileResult;
        }
    }
}
