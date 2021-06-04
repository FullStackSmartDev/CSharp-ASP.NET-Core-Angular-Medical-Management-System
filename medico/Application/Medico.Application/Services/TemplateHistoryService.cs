using System;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.Extensions;
using Medico.Application.Interfaces;
using Medico.Application.Services.PatientChart;
using Medico.Application.ViewModels.TemplateHistory;
using Medico.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Medico.Application.Services
{
    public class TemplateHistoryService : ITemplateHistoryService
    {
        private readonly IAdmissionRepository _admissionRepository;
        private readonly ITemplateService _templateService;

        public TemplateHistoryService(IAdmissionRepository admissionRepository,
            ITemplateService templateService)
        {
            _admissionRepository = admissionRepository;
            _templateService = templateService;
        }

        public async Task<TemplateHistoryVm> GetPreviousDetailedTemplateContent(Guid admissionId, Guid templateId,
            Guid patientId)
        {
            var template = await _templateService.GetById(templateId);
            if (template != null && !template.IsHistorical)
                return TemplateHistoryVm.Empty;

            var patientAdmissions = await _admissionRepository
                .GetAll()
                .Include(a => a.Appointment)
                .Where(a => a.PatientId == patientId)
                .ToListAsync();

            var specifiedAdmission =
                patientAdmissions.First(a => a.Id == admissionId);

            var previousAdmissionsAccordingSpecified = patientAdmissions
                .Where(a => a.Appointment.StartDate < specifiedAdmission.Appointment.StartDate)
                .OrderByDescending(a => a.Appointment.StartDate)
                .ToList();

            if (!previousAdmissionsAccordingSpecified.Any())
                return TemplateHistoryVm.Empty;

            foreach (var previousAdmission in previousAdmissionsAccordingSpecified)
            {
                var documentNode =
                    JsonConvert.DeserializeObject<PatientChartNode>(previousAdmission.AdmissionData);

                var previousTemplateNode = documentNode.FirstOrDefault(n =>
                {
                    var nodeType = n.Type;
                    if (nodeType != PatientChartNodeType.TemplateNode)
                        return false;

                    return n.Attributes.NodeSpecificAttributes.TemplateId == templateId;
                });

                if (previousTemplateNode == null)
                    continue;

                bool isDetailedTemplateUsed =
                    previousTemplateNode.Value.isDetailedTemplateUsed;

                if (!isDetailedTemplateUsed)
                    return TemplateHistoryVm.Empty;

                string templateDetailedContent = previousTemplateNode
                    .Value.detailedTemplateHtml;

                return TemplateHistoryVm.Create(previousAdmission.Appointment.StartDate, templateDetailedContent);
            }

            return TemplateHistoryVm.Empty;
        }
    }
}