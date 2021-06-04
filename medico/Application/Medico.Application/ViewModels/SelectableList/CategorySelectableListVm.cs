using System;

namespace Medico.Application.ViewModels.SelectableList
{
    public class CategorySelectableListVm : BaseActiveCompanyRelatedViewModel
    {
        public string Category { get; set; }

        public string Title { get; set; }

        public bool IsPredefined { get; set; }

        public Guid? LibrarySelectableListId { get; set; }
    }
}