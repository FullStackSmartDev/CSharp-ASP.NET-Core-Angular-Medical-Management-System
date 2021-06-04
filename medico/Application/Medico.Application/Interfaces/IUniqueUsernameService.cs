using System;

namespace Medico.Application.Interfaces
{
    public interface IUniqueUsernameService
    {
        string Get(string email, Guid companyId);
    }
}
