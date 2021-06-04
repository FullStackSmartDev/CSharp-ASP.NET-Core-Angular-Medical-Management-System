namespace Medico.Application.SelectableItemsManagement
{
    public class SelectableVariable
    {
        public SelectableVariableType Type { get; private set; }

        public string VariableName { get; private set; }

        public string VariableValue { get; private set; }

        public static SelectableVariable CreateSelectableVariable(SelectableVariableType type,
            string variableName, string variableValue)
        {
            return new SelectableVariable
            {
                Type = type,
                VariableName = variableName,
                VariableValue = variableValue
            };
        }
    }
}