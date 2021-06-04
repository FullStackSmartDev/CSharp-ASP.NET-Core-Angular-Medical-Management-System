using DevExtreme.AspNet.Data;
using Medico.Application.ViewModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Medico.Api.ModelBinding
{
    public class RoomDxOptionsBinder : BaseDxOptionsBinder
    {
        protected override DataSourceLoadOptionsBase GetLoadOptions(ModelBindingContext bindingContext)
        {
            var roomLoadOptions = new RoomDxOptionsViewModel();

            roomLoadOptions.LocationId = ExtractGuid(bindingContext,
                nameof(roomLoadOptions.LocationId));

            roomLoadOptions.CompanyId= ExtractGuid(bindingContext,
                nameof(roomLoadOptions.CompanyId));

            return roomLoadOptions;
        }
    }
}