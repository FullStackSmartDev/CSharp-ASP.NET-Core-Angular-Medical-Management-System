using System;
using Medico.Application.Interfaces;
using SelectPdf;

namespace Medico.Application.Services
{
    public class ReportService : IReportService
    {
        public byte[] GenerateFromHtmlString(string htmlStringContent)
        {
            var converter = new HtmlToPdf();

            converter.Options.MarginLeft = 15;
            converter.Options.MarginRight = 15;
            converter.Options.MarginBottom = 15;
            converter.Options.MarginTop = 15;

            if (string.IsNullOrEmpty(htmlStringContent))
                throw new InvalidOperationException("Report content is empty");

            var doc = converter.ConvertHtmlString(htmlStringContent);
            var pdfContent = doc.Save();
            doc.Close();

            return pdfContent;
        }
    }
}
