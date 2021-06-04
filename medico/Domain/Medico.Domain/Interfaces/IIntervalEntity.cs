using System;

namespace Medico.Domain.Interfaces
{
    public interface IIntervalEntity
    {
        DateTime StartDate { get; set; }

        DateTime EndDate { get; set; }
    }
}
