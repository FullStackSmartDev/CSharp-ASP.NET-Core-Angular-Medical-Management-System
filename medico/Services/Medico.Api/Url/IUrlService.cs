using System;

namespace Medico.Api.Url
{
    public interface IUrlService
    {
        Uri GenerateEmailConfirmationUrl(string userId, string confirmationCode);

        Uri GenerateForgotPasswordUrl(string userId, string confirmationCode);
    }
}