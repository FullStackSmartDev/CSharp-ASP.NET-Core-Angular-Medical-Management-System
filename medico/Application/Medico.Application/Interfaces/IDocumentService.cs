using System;
using System.Threading.Tasks;
using Medico.Application.ViewModels;

namespace Medico.Application.Interfaces
{
    public interface IDocumentService 
    {
        Task<DocumentViewModel> GetById(Guid id);

        Task<DocumentViewModel> Create(DocumentViewModel admissionViewModel);

        Task<DocumentViewModel> Update(DocumentViewModel admissionViewModel);

        Task<DocumentViewModel> GetByPatientId(Guid patientId);
    }
}
