using System;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface ISignatureInfoService
    {
        Task<SignatureInfoViewModel> GetById(Guid id);

        Task<SignatureInfoViewModel> GetByAdmissionId(Guid admissionId);

        Task<SignatureInfoViewModel> Create(SignatureInfoViewModel signatureInfoViewModel);

        Task<SignatureInfoViewModel> Update(SignatureInfoViewModel signatureInfoViewModel);
    }
}
