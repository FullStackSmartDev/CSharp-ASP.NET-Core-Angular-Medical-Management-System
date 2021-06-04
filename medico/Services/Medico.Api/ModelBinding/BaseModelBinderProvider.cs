using System;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Medico.Api.ModelBinding
{
    public class CompanyDxOptionsModelBinderProvider :
        BaseModelBinderProvider<CompanyDxOptionsViewModel, CompanyDxOptionsBinder>
    {
    }

    public class DateRangeDxOptionsModelBinderProvider :
        BaseModelBinderProvider<DateRangeDxOptionsViewModel, DateRangeDxOptionsBinder>
    {
    }

    public class AppointmentDxOptionsModelBinderProvider :
        BaseModelBinderProvider<AppointmentDxOptionsViewModel, AppointmentDxOptionsBinder>
    {
    }

    public class DxOptionsModelBinderProvider :
        BaseModelBinderProvider<DxOptionsViewModel, DxOptionsBinder>
    {
    }

    public class RoomDxOptionsModelBinderProvider :
        BaseModelBinderProvider<RoomDxOptionsViewModel, RoomDxOptionsBinder>
    {
    }

    public class TemplateDxOptionsModelBinderProvider :
        BaseModelBinderProvider<TemplateDxOptionsViewModel, TemplateDxOptionsBinder>
    {
    }

    public class UserDxOptionsModelBinderProvider :
        BaseModelBinderProvider<UserDxOptionsViewModel, UserDxOptionsBinder>
    {
    }

    public class HistoryDxOptionsModelBinderProvider :
        BaseModelBinderProvider<HistoryDxOptionsViewModel, HistoryDxOptionsBinder>
    {
    }

    public class VitalSignsDxOptionsModelBinderProvider :
        BaseModelBinderProvider<PatientAdmissionDxOptionsViewModel, VitalSignsDxOptionsBinder>
    {
    }

    public class BaseModelBinderProvider<TModel, TBinder>
        : IModelBinderProvider where TBinder : class, IModelBinder, new()
    {
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            var modelType = context.Metadata.UnderlyingOrModelType;

            return modelType == typeof(TModel)
                ? new TBinder()
                : null;
        }
    }
}