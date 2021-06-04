using System;
using System.ComponentModel.DataAnnotations;

namespace Medico.Application.ViewModels
{
    public class RoomViewModel : BaseActiveViewModel
    {
        [Required]
        public Guid LocationId { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
