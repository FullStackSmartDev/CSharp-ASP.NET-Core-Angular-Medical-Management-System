using System;
using Medico.Application.ViewModels;
using Microsoft.Extensions.Options;

namespace Medico.Api.Url
{
    public class UrlService : IUrlService
    {
        private readonly UriViewModel _urlSettings;

        public UrlService(IOptions<UriViewModel> urlSettings)
        {
            _urlSettings = urlSettings.Value;
        }
        
        public Uri GenerateEmailConfirmationUrl(string userId, string confirmationCode)
        {
            var patientPortalBaseUrl = _urlSettings.PatientPortalBaseUrl;
            var emailConfirmationUrlString =
                $"{patientPortalBaseUrl}confirm-email?userId={userId}&code={confirmationCode}";
            
            return new Uri(emailConfirmationUrlString);
        }

        public Uri GenerateForgotPasswordUrl(string userId, string confirmationCode)
        {
            var patientPortalBaseUrl = _urlSettings.PatientPortalBaseUrl;
            var forgotPasswordUrlString =
                $"{patientPortalBaseUrl}forgot-password?userId={userId}&code={confirmationCode}";

            return new Uri(forgotPasswordUrlString);
        }
    }
}