using System.Collections.Generic;
using Medico.Application.ViewModels;

namespace Medico.Application.MedicationsUpdate
{
    public interface IMedicationFileReader
    {
        IEnumerable<NdcMedicationViewModel> ReadFromFile(string filePath);
    }
}