﻿using Medico.Data.Context;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;

namespace Medico.Data.Repository
{
    public class MedicationHistoryRepository
        : Repository<MedicationHistory>, IMedicationHistoryRepository
    {
        public MedicationHistoryRepository(MedicoContext context)
            : base(context)
        {
        }
    }
}
