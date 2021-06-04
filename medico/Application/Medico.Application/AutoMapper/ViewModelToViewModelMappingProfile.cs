using System;
using AutoMapper;
using Medico.Application.ViewModels;

namespace Medico.Application.AutoMapper
{
    public class ViewModelToViewModelMappingProfile : Profile
    {
        public ViewModelToViewModelMappingProfile()
        {
            CreateMap<MedicationItemViewModel, MedicationConfigurationExistenceViewModel>();

            CreateMap<MedicationPrescriptionViewModel, MedicationHistoryViewModel>()
                .ForMember(d => d.CreateDate, opt => opt.MapFrom(s => DateTime.UtcNow))
                .ForMember(d => d.MedicationStatus, opt => opt.MapFrom(s => "Current"))
                .ForMember(d => d.Prn, opt => opt.MapFrom(s => false));

        }
    }
}
