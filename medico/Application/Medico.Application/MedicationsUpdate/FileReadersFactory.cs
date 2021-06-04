using System;
using System.Collections.Generic;
using System.IO;

namespace Medico.Application.MedicationsUpdate
{
    public static class FileReadersFactory
    {
        private static readonly Dictionary<string, Func<IMedicationFileReader>> FileReadersExtensionsMap = new Dictionary<string, Func<IMedicationFileReader>>();

        static FileReadersFactory()
        {
            FileReadersExtensionsMap[".xls"] = () => new MedicationsExcelXlsFileReader();
        }

        public static IMedicationFileReader Create(string fileName)
        {
            var extension = Path.GetExtension(fileName);

            var creator = GetCreator(extension);
            return creator?.Invoke();
        }

        private static Func<IMedicationFileReader> GetCreator(string extension)
        {
            FileReadersExtensionsMap.TryGetValue(extension, out var medicationFileReader);
            return medicationFileReader;
        }
    }
}