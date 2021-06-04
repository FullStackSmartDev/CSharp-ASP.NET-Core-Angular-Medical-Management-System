using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ExcelDataReader;
using Medico.Application.ViewModels;

namespace Medico.Application.MedicationsUpdate
{
    public class MedicationsExcelXlsFileReader : IMedicationFileReader
    {
        public IEnumerable<NdcMedicationViewModel> ReadFromFile(string filePath)
        {
            var medicationList = new List<NdcMedicationViewModel>();

            using (var stream = File.Open(filePath, FileMode.Open, FileAccess.Read))
            {
                using (var reader = ExcelReaderFactory.CreateCsvReader(stream))
                {
                    var isFirstHeaderRowProceeded = false;
                    var columnsHeaderMetadata = InitialColumnsHeaderMetadata;

                    do
                    {
                        while (reader.Read())
                        {
                            if (!isFirstHeaderRowProceeded)
                            {
                                SetColumnsHeaderPositions(columnsHeaderMetadata, reader);
                                isFirstHeaderRowProceeded = true;
                            }
                            else
                            {
                                var medication = CreateNdcMedication(reader, columnsHeaderMetadata);
                                medicationList.Add(medication);
                            }
                        }
                    } while (reader.NextResult());
                }
            }

            return medicationList;
        }

        private static NdcMedicationViewModel CreateNdcMedication(IExcelDataReader reader,
            IList<HeaderColumnMetadata> columnsMetadata)
        {
            return new NdcMedicationViewModel
            {
                NdcCode = GetColumnValue(reader, NdcCodeFieldName, columnsMetadata),
                MedicationName = GetColumnValue(reader, MedicationNameFieldName, columnsMetadata),
                Route = GetColumnValue(reader, RouteFieldName, columnsMetadata),
                Strength = GetColumnValue(reader, StrengthFieldName, columnsMetadata),
                Unit = GetColumnValue(reader, UnitFieldName, columnsMetadata),
                Classes = GetColumnValue(reader, ClassesFieldName, columnsMetadata),
                DosageForm = GetColumnValue(reader, DosageFormFieldName, columnsMetadata)
            };
        }

        private static string GetColumnValue(IExcelDataReader reader,
            string columnName, IEnumerable<HeaderColumnMetadata> columnsMetadata)
        {
            var columnMetadata = columnsMetadata
                .FirstOrDefault(c => c.ColumnName == columnName);

            if (columnMetadata?.Position == null)
                throw new InvalidOperationException($"Unable to find value for column: {columnName}");

            return reader.GetString(columnMetadata.Position.Value);
        }

        private void SetColumnsHeaderPositions(IList<HeaderColumnMetadata> columnsHeaderMetadata,
            IExcelDataReader reader)
        {
            for (var i = 0; i < reader.FieldCount; i++)
            {
                var columnName = reader.GetString(i);
                var headerColumnMetadata = columnsHeaderMetadata
                    .FirstOrDefault(c => c.Alias == columnName);

                if (headerColumnMetadata != null)
                    headerColumnMetadata.Position = i;
            }
        }

        private IList<HeaderColumnMetadata> InitialColumnsHeaderMetadata => new List<HeaderColumnMetadata>
        {
            new HeaderColumnMetadata(NdcCodeFieldName, MedicationExcelFileColumnNames.PRODUCTNDC),
            new HeaderColumnMetadata(MedicationNameFieldName,MedicationExcelFileColumnNames.PROPRIETARYNAME),
            new HeaderColumnMetadata(DosageFormFieldName,MedicationExcelFileColumnNames.DOSAGEFORMNAME),
            new HeaderColumnMetadata(StrengthFieldName, MedicationExcelFileColumnNames.ACTIVE_NUMERATOR_STRENGTH),
            new HeaderColumnMetadata(UnitFieldName, MedicationExcelFileColumnNames.ACTIVE_INGRED_UNIT),
            new HeaderColumnMetadata(RouteFieldName,MedicationExcelFileColumnNames.ROUTENAME),
            new HeaderColumnMetadata(ClassesFieldName, MedicationExcelFileColumnNames.PHARM_CLASSES)
        };

        private static string NdcCodeFieldName =>
            nameof(NdcMedicationViewModel.Empty.NdcCode);

        private static string MedicationNameFieldName =>
            nameof(NdcMedicationViewModel.Empty.MedicationName);

        private static string DosageFormFieldName =>
            nameof(NdcMedicationViewModel.Empty.DosageForm);

        private static string RouteFieldName =>
            nameof(NdcMedicationViewModel.Empty.Route);

        private static string UnitFieldName =>
            nameof(NdcMedicationViewModel.Empty.Unit);

        private static string StrengthFieldName =>
            nameof(NdcMedicationViewModel.Empty.Strength);

        private static string ClassesFieldName =>
            nameof(NdcMedicationViewModel.Empty.Classes);
    }
}