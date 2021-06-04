using System.IO;
using System.Threading.Tasks;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Http;

namespace Medico.Application.Interfaces
{
    public interface IFileService
    {
        Task<FileInfoViewModel> Save(string directoryPath, IFormFile file, string fileName = "");

        Task<Stream> Get(string directoryPath, string fileName);
    }
}
