using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class DocumentService : BaseDeletableByIdService<Document, DocumentViewModel>,
        IDocumentService
    {
        public DocumentService(IDocumentRepository documentRepository,
            IMapper mapper) : base(documentRepository, mapper)
        {
        }

        public async Task<DocumentViewModel> GetByPatientId(Guid patientId)
        {
            var document = await Repository.GetAll()
                .FirstOrDefaultAsync(a => a.PatientId == patientId);

            return document == null
                ? null
                : Mapper.Map<DocumentViewModel>(document);
        }
    }
}
