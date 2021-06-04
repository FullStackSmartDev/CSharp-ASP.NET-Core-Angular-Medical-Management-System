using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IAppointmentService
    {
        Task<AppointmentGridItemViewModel> GetAppointmentGridItemById(Guid id);

        IQueryable<AppointmentGridItemViewModel> GetAllAppointmentGridItems(AppointmentDxOptionsViewModel dxOptions);

        Task<AppointmentViewModel> Create(AppointmentViewModel appointmentViewModel);

        Task<AppointmentViewModel> Update(AppointmentViewModel appointmentViewModel);

        IQueryable<AppointmentGridItemViewModel> GetAll(AppointmentDxOptionsViewModel dxOptions);

        Task Delete(Guid id);

        Task<AppointmentViewModel> GetPatientLastVisit(Guid patientId, DateTime currentDate);

        Task<IEnumerable<AppointmentGridItemViewModel>> GetPatientPreviousVisits(Guid patientId, DateTime currentDate);

        Task<AppointmentViewModel> GetByAdmissionId(Guid admissionId);

        Task<AppointmentViewModel> GetByLocationId(Guid locationId);

        Task<AppointmentViewModel> GetByRoomId(Guid roomId);

        Task<AppointmentViewModel> GetByUserId(Guid userId);

        Task<AppointmentViewModel> GetById(Guid id);
    }
}
