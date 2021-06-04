using System;
using System.Threading.Tasks;
using AutoMapper;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class SignatureInfoService : BaseService<SignatureInfo, SignatureInfoViewModel>, ISignatureInfoService
    {
        public SignatureInfoService(ISignatureInfoRepository signatureInfoRepository,
            IMapper mapper) : base(signatureInfoRepository, mapper)
        {
        }

        public async Task<SignatureInfoViewModel> GetByAdmissionId(Guid admissionId)
        {
            var signatureInfo = await Repository.GetAll()
                .FirstOrDefaultAsync(s => s.AdmissionId == admissionId);

            return signatureInfo == null
                ? null
                : Mapper.Map<SignatureInfoViewModel>(signatureInfo);
        }
    }
}
