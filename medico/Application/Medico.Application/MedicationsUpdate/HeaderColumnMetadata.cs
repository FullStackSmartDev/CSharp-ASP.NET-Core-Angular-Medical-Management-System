namespace Medico.Application.MedicationsUpdate
{
    public class HeaderColumnMetadata
    {
        public string Alias { get; }

        public string ColumnName { get; }

        public int? Position { get; set; }

        public HeaderColumnMetadata(string columnName, string alias)
        {
            Alias = alias;
            ColumnName = columnName;
            Position = null;
        }
    }
}