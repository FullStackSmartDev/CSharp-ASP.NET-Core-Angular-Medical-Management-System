using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels.ReferenceTable
{
    public class ReferenceTableVm : ReferenceTableGridItemVm
    {
        [Required]
        public ReferenceTableData Data { get; set; }
    }
}