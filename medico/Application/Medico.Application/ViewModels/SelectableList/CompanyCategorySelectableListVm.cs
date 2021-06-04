namespace Medico.Application.ViewModels.SelectableList
{
    public class CompanyCategorySelectableListVm : CategorySelectableListVm
    {
        public int ? Version { get; set; }
        
        public int ? LibrarySelectableListVersion { get; set; }
    }
}