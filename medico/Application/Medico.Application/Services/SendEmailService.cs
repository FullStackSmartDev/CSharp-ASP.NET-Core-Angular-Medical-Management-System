using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Medico.Application.Services
{
    public class SendEmailService : ISendEmailService
    {
        private readonly IOptions<SendEmailViewModel> _mailSettings;

        public SendEmailService(IOptions<SendEmailViewModel> mailSettings)
        {
            _mailSettings = mailSettings;
        }

        public async Task SendEmailAsync(string emailTo,  string subject, string smtpMsg)
        {
            var mailSettingsValue = _mailSettings.Value;
            var client = new SendGridClient(mailSettingsValue.ApiKey);
            var from = new EmailAddress(mailSettingsValue.From, "Administrator");
            var to = new EmailAddress(emailTo, "Patient User");
            var msg = MailHelper.CreateSingleEmail(from, to, subject, smtpMsg, smtpMsg);
            var response = await client.SendEmailAsync(msg);
        }
    }
}
