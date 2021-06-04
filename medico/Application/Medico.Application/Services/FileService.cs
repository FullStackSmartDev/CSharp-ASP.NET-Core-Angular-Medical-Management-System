using System.IO;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Http;

namespace Medico.Application.Services
{
    public class FileService : IFileService
    {
        public async Task<FileInfoViewModel> Save(string directoryPath,
            IFormFile file, string fileName = null)
        {
            var isDirectoryExists = Directory.Exists(directoryPath);
            if (!isDirectoryExists)
                Directory.CreateDirectory(directoryPath);

            var fileNameToSave = string.IsNullOrEmpty(fileName)
                ? file.FileName
                : fileName;

            var filePath = Path.Combine(directoryPath, fileNameToSave);

            var isFileExists = File.Exists(filePath);

            var fileInfoViewModel = new FileInfoViewModel
            {
                FileName = file.FileName,
                FilePath = filePath
            };

            if (isFileExists)
                return fileInfoViewModel;

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return fileInfoViewModel;
        }

        public async Task<Stream> Get(string directoryPath, string fileName)
        {
            var filePath = Path.Combine(directoryPath, fileName);
            if (!File.Exists(filePath))
                return new MemoryStream();

            var memoryStream = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memoryStream);
            }
            memoryStream.Position = 0;
            return memoryStream;
        }
    }
}
