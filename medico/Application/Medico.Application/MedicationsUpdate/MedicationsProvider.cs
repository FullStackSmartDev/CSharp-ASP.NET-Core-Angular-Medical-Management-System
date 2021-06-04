using System;
using System.Collections.Generic;
using System.IO;
using Medico.Application.ViewModels;

namespace Medico.Application.MedicationsUpdate
{
    public class MedicationsProvider
    {
        public IEnumerable<NdcMedicationViewModel> GetMedicationsFromFile(string filePath)
        {
            var fileName = Path.GetFileName(filePath);

            var isFileExist = File.Exists(filePath);
            if (!isFileExist)
                throw new FileNotFoundException($"Unable to find the source file: {fileName}");

            var medicationsFileReader = FileReadersFactory.Create(fileName);
            if (medicationsFileReader == null)
                throw new InvalidOperationException($"Unable to find file reader for specific file extension: {fileName}");

            return medicationsFileReader.ReadFromFile(filePath);
        }
    }
}