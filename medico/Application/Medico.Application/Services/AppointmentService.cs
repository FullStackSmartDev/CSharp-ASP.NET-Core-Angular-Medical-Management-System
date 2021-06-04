using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using DevExtreme.AspNet.Data;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class AppointmentService : BaseDeletableByIdService<Appointment, AppointmentViewModel>, IAppointmentService
    {
        private readonly IAppointmentGridItemRepository _appointmentGridItemRepository;

        public AppointmentService(IAppointmentGridItemRepository appointmentGridItemRepository,
            IAppointmentRepository appointmentRepository,
            IMapper mapper) : base(appointmentRepository, mapper)
        {
            _appointmentGridItemRepository = appointmentGridItemRepository;
        }

        public async Task<AppointmentViewModel> GetByAdmissionId(Guid admissionId)
        {
            var appointment = await Repository.GetAll()
                .FirstOrDefaultAsync(a => a.AdmissionId == admissionId);

            return appointment == null
                ? null
                : Mapper.Map<AppointmentViewModel>(appointment);
        }

        public async Task<AppointmentGridItemViewModel> GetAppointmentGridItemById(Guid id)
        {
            var appointmentGridItem = await _appointmentGridItemRepository
                .GetAll()
                .FirstOrDefaultAsync(gi => gi.Id == id);

            return appointmentGridItem == null
                ? null
                : Mapper.Map<AppointmentGridItemViewModel>(appointmentGridItem);
        }

        public IQueryable<AppointmentGridItemViewModel> GetAllAppointmentGridItems(AppointmentDxOptionsViewModel dxOptions)
        {
            var companyId = dxOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<AppointmentGridItemViewModel>().AsQueryable();

            var query = _appointmentGridItemRepository.GetAll()
                .Where(a => a.CompanyId == companyId);

            query = ApplyIntervalFilter(dxOptions.StartDate, dxOptions.EndDate, query, out var isIntervalFilterApplied);
            query = ApplyFilter(dxOptions, query);

            dxOptions.Sort = new []
            {
                new SortingInfo
                {
                    Desc = false,
                    Selector = "startDate"
                } 
            };

            return query.ProjectTo<AppointmentGridItemViewModel>();
        }

        public IQueryable<AppointmentGridItemViewModel> GetAll(AppointmentDxOptionsViewModel dxOptions)
        {
            var companyId = dxOptions.CompanyId;
            if (companyId == Guid.Empty)
                return Enumerable.Empty<AppointmentGridItemViewModel>().AsQueryable();

            var query = _appointmentGridItemRepository.GetAll()
                .Where(a => a.CompanyId == companyId);

            query = ApplyIntervalFilter(dxOptions.StartDate, dxOptions.EndDate, query, out var isIntervalFilterApplied);
            query = ApplyFilter(dxOptions, query);

            return query.ProjectTo<AppointmentGridItemViewModel>();
        }

        public Task Delete(Guid id)
        {
            return DeleteById(id);
        }

        public async Task<AppointmentViewModel> GetPatientLastVisit(Guid patientId, DateTime currentDate)
        {
            var appointment = await Repository.GetAll()
                .Where(a => a.PatientId == patientId && a.StartDate < currentDate)
                .OrderByDescending(a => a.StartDate)
                .FirstOrDefaultAsync();
            if (appointment == null)
                return null;

            return Mapper.Map<AppointmentViewModel>(appointment);
        }

        public async Task<IEnumerable<AppointmentGridItemViewModel>> GetPatientPreviousVisits(Guid patientId, DateTime currentDate)
        {
            var previousAppointments = await _appointmentGridItemRepository.GetAll()
                .Where(a => a.PatientId == patientId && a.StartDate < currentDate)
                .OrderByDescending(a => a.StartDate).ProjectTo<AppointmentGridItemViewModel>()
                .ToListAsync();

            return previousAppointments;
        }

        public async Task<AppointmentViewModel> GetByLocationId(Guid locationId)
        {
            var appointment = await Repository.GetAll()
                .FirstOrDefaultAsync(a => a.LocationId == locationId);

            return appointment == null
                ? null
                : Mapper.Map<AppointmentViewModel>(appointment);
        }

        public async Task<AppointmentViewModel> GetByRoomId(Guid roomId)
        {
            var appointment = await Repository.GetAll()
                .FirstOrDefaultAsync(a => a.RoomId == roomId);

            return appointment == null
                ? null
                : Mapper.Map<AppointmentViewModel>(appointment);
        }

        public async Task<AppointmentViewModel> GetByUserId(Guid userId)
        {
            var appointment = await Repository.GetAll()
                .FirstOrDefaultAsync(a => a.PhysicianId == userId || a.NurseId == userId);

            return appointment == null
                ? null
                : Mapper.Map<AppointmentViewModel>(appointment);
        }

        private static IQueryable<AppointmentGridItem> ApplyFilter(AppointmentDxOptionsViewModel dxOptions,
            IQueryable<AppointmentGridItem> query)
        {
            var locationId = dxOptions.LocationId;
            if (locationId != Guid.Empty)
            {
                query = query.Where(a => a.LocationId == locationId);
            }

            var patientId = dxOptions.PatientId;
            if (patientId != Guid.Empty)
            {
                query = query.Where(a => a.PatientId == patientId);
            }

            var physicianId = dxOptions.PhysicianId;
            if (physicianId != Guid.Empty)
            {
                query = query.Where(a => a.PhysicianId == physicianId);
            }

            return query;
        }
    }
}
