using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.ExpressionItemsManagement;
using Medico.Application.Interfaces;
using Medico.Application.SelectableItemsManagement;
using Medico.Application.ViewModels.ExpressionExecution;
using Newtonsoft.Json.Linq;
using RazorEngine;
using RazorEngine.Templating;

namespace Medico.Application.Services
{
    public class ExpressionExecutionService : IExpressionExecutionService
    {
        private readonly IAdmissionService _admissionService;
        private readonly IExpressionItemsService _expressionItemsService;
        private readonly IExpressionService _expressionService;
        private readonly IReferenceTableService _referenceTableService;
        private readonly IPatientService _patientService;
        private readonly ISelectableItemsService _selectableItemsService;

        public ExpressionExecutionService(IAdmissionService admissionService,
            IExpressionItemsService expressionItemsService,
            IExpressionService expressionService,
            IReferenceTableService referenceTableService,
            IPatientService patientService,
            ISelectableItemsService selectableItemsService)
        {
            _admissionService = admissionService;
            _expressionItemsService = expressionItemsService;
            _expressionService = expressionService;
            _referenceTableService = referenceTableService;
            _patientService = patientService;
            _selectableItemsService = selectableItemsService;
        }

        public async Task<string> CalculateExpressionsInTemplate(
            ExpressionExecutionRequestVm expressionExecutionRequest)
        {
            var admissionId = expressionExecutionRequest.AdmissionId;

            var admission = await _admissionService
                .GetFullAdmissionInfoById(admissionId);

            var patient = await _patientService.GetByIdWithVitalSigns(admission.PatientId);

            var htmlContent = expressionExecutionRequest.DetailedTemplateContent;

            var idToExpressionIdDictionary =
                _expressionItemsService.GeIdToExpressionIdDictionaryFromHtmlContent(htmlContent);

            var expressionIds = idToExpressionIdDictionary.Values;
            if (!expressionIds.Any())
                return htmlContent;

            var expressions =
                await _expressionService.GetAll(e => expressionIds.Contains(e.Id));

            var selectableVariables =
                _selectableItemsService.GetSelectableVariablesFromHtmlContent(htmlContent);

            var elementIdToExpressionResultDictionary = new Dictionary<Guid, string>();

            foreach (var idToExpressionId in idToExpressionIdDictionary)
            {
                var expressionId = idToExpressionId.Value;

                var expression =
                    expressions.FirstOrDefault(e => e.Id == expressionId);

                var elementId = idToExpressionId.Key;

                try
                {
                    var expressionReferenceTables =
                        await GetExpressionReferenceTables(expressionId);

                    var expressionExecutionContextVm = new ExpressionExecutionContextVm
                    {
                        VitalSigns = admission.VitalSigns,
                        Patient = patient.Patient,
                        BaseVitalSigns = patient.BaseVitalSigns,
                        SelectableVariables = selectableVariables,
                        ReferenceTables = expressionReferenceTables
                    };

                    var expressionResult = Engine.Razor.RunCompile(expression.Template, Guid.NewGuid().ToString(),
                        typeof(ExpressionExecutionContextVm),
                        expressionExecutionContextVm
                    );

                    elementIdToExpressionResultDictionary.Add(elementId, expressionResult);
                }
                catch (Exception e)
                {
                    elementIdToExpressionResultDictionary.Add(elementId,
                        $"Error happened during expression execution {expression.Title}");
                }
            }

            return _expressionItemsService.UpdateExpressionItems(elementIdToExpressionResultDictionary, htmlContent);
        }

        public async Task<string> CalculateExpression(ExpressionExecutionRequestVm expressionExecutionRequest)
        {
            var admissionId = expressionExecutionRequest.AdmissionId;

            var admission = await _admissionService
                .GetFullAdmissionInfoById(admissionId);

            var patient = await _patientService
                .GetByIdWithVitalSigns(admission.PatientId);

            var expressionTemplate =
                expressionExecutionRequest.DetailedTemplateContent;

            IDictionary<string, JObject[]> expressionReferenceTables;

            var referenceTableIds = expressionExecutionRequest
                .ReferenceTableIds;

            if (referenceTableIds == null || !referenceTableIds.Any())
                expressionReferenceTables = new Dictionary<string, JObject[]>();
            else
            {
                expressionReferenceTables = (await _referenceTableService
                        .GetAll(t => expressionExecutionRequest.ReferenceTableIds.Contains(t.Id)))
                    .ToDictionary(t => t.Title, t => t.Data.Body);
            }

            string expressionResult;

            try
            {
                expressionResult =
                    Engine.Razor.RunCompile(expressionTemplate, Guid.NewGuid().ToString(),
                        typeof(ExpressionExecutionContextVm),
                        new ExpressionExecutionContextVm
                        {
                            Patient = patient.Patient,
                            VitalSigns = admission.VitalSigns,
                            BaseVitalSigns = patient.BaseVitalSigns,
                            SelectableVariables =
                                _selectableItemsService.GetSelectableVariablesFromHtmlContent(string.Empty, true),
                            ReferenceTables = expressionReferenceTables
                        });
            }
            catch (Exception e)
            {
                expressionResult = e.ToString();
            }

            return expressionResult;
        }

        private async Task<IDictionary<string, JObject[]>> GetExpressionReferenceTables(Guid expressionId)
        {
            var expressionReferenceTableLookups =
                await _expressionService.GetReferenceTables(expressionId);

            var expressionReferenceTableIds =
                expressionReferenceTableLookups.Select(t => t.Id);

            return (await _referenceTableService
                    .GetAll(t => expressionReferenceTableIds.Contains(t.Id)))
                .ToDictionary(t => t.Title, t => t.Data.Body);
        }
    }
}