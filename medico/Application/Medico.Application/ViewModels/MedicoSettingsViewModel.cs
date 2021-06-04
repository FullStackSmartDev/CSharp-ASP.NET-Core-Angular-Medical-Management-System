using System;

namespace Medico.Application.ViewModels
{
    public class MedicoSettingsViewModel
    {
        public Guid InitializationKey { get; set; }

        public string SuperAdminPasswordHash { get; set; }

        public string ScanDocumentUploadPath { get; set; }

        public string MedicationsExcelFilesUploadPath { get; set; }

        public bool IsLibraryHost { get; set; }
    }
}
