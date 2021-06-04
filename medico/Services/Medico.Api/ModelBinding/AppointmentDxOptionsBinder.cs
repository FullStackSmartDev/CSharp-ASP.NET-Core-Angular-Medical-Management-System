using DevExtreme.AspNet.Data;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Medico.Api.ModelBinding
{
    public class AppointmentDxOptionsBinder : BaseDxOptionsBinder
    {
        protected override DataSourceLoadOptionsBase GetLoadOptions(ModelBindingContext bindingContext)
        {
            var appointmentLoadOptions = new AppointmentDxOptionsViewModel();

            appointmentLoadOptions.StartDate =
                ExtractDate(bindingContext, nameof(appointmentLoadOptions.StartDate));

            appointmentLoadOptions.EndDate =
                ExtractDate(bindingContext, nameof(appointmentLoadOptions.EndDate));

            appointmentLoadOptions.LocationId =
                ExtractGuid(bindingContext, nameof(appointmentLoadOptions.LocationId));

            appointmentLoadOptions.PhysicianId =
                ExtractGuid(bindingContext, nameof(appointmentLoadOptions.PhysicianId));

            appointmentLoadOptions.PatientId =
                ExtractGuid(bindingContext, nameof(appointmentLoadOptions.PatientId));

            appointmentLoadOptions.CompanyId =
                ExtractGuid(bindingContext, nameof(appointmentLoadOptions.CompanyId));

            return appointmentLoadOptions;
        }
    }
}
