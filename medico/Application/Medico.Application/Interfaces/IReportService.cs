namespace Medico.Application.Interfaces
{
    public interface IReportService
    {
        byte[] GenerateFromHtmlString(string htmlStringContent);
    }
}
