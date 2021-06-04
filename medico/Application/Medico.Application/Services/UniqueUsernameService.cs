using System;
using Medico.Application.Interfaces;

namespace Medico.Application.Services
{
    public class UniqueUsernameService : IUniqueUsernameService
    {
        public string Get(string email, Guid companyId)
        {
            return $"{email}_{companyId}";
        }
    }
}
