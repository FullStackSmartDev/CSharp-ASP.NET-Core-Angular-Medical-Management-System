using DevExtreme.AspNet.Data;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Medico.Api.ModelBinding
{
    public class VitalSignsDxOptionsBinder : BaseDxOptionsBinder
    {
        protected override DataSourceLoadOptionsBase GetLoadOptions(ModelBindingContext bindingContext)
        {
            var vitalSignsLoadOptions = new PatientAdmissionDxOptionsViewModel();

            vitalSignsLoadOptions.PatientId = ExtractGuid(bindingContext,
                nameof(vitalSignsLoadOptions.PatientId));

            vitalSignsLoadOptions.AdmissionId = ExtractGuid(bindingContext,
                nameof(vitalSignsLoadOptions.AdmissionId));

            return vitalSignsLoadOptions;
        }
    }
}