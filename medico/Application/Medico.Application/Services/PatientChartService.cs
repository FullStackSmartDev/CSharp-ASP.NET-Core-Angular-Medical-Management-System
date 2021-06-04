using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.Interfaces;
using Medico.Application.Services.PatientChart;
using Medico.Application.ViewModels;
using Medico.Application.ViewModels.PatientChart;
using Medico.Application.ViewModels.PatientChartDocument;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Medico.Application.Services
{
    public class PatientChartService : IPatientChartService
    {
        private const string RootNodeName = "patientChart";
        private const string RootNodeTitle = "Patient Chart";

        private readonly IPatientChartDocumentNodeRepository _patientChartDocumentNodeRepository;
        private readonly IUnitOfWork _unitOfWork;

        private readonly JsonSerializerSettings _jsonSerializerSettings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        public PatientChartService(IPatientChartDocumentNodeRepository patientChartDocumentNodeRepository,
            IUnitOfWork unitOfWork)
        {
            _patientChartDocumentNodeRepository = patientChartDocumentNodeRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<PatientChartNode> GetByFilter(PatientChartDocumentFilterVm searchFilterVm)
        {
            var rootNodeId = Guid.NewGuid();
            var rootNode = new PatientChartNode
            {
                Id = rootNodeId,
                Name = RootNodeName,
                Title = RootNodeTitle,
                Type = PatientChartNodeType.RootNode,
                Attributes = new PatientChartNodeAttributes
                {
                    Order = 1,
                    IsActive = true,
                    IsPredefined = true
                },
                Children = new List<PatientChartNode>()
            };

            var patientChartDocumentsQuery = _patientChartDocumentNodeRepository
                .GetAll();

            var companyId = searchFilterVm.CompanyId;
            if (companyId == null)
                patientChartDocumentsQuery = patientChartDocumentsQuery
                    .Where(d => d.CompanyId == null);
            else
                patientChartDocumentsQuery = patientChartDocumentsQuery
                    .Where(d => d.CompanyId == companyId.Value);

            var patientChartDocumentId = searchFilterVm.PatientChartDocumentId;
            if (patientChartDocumentId.HasValue)
                patientChartDocumentsQuery = patientChartDocumentsQuery
                    .Where(d => d.Id == patientChartDocumentId.Value);
            
            var companyDocumentNodes = await patientChartDocumentsQuery
                .ToListAsync();

            if (companyDocumentNodes.Count == 0)
                throw new InvalidOperationException("Company have to have at least one document node");

            companyDocumentNodes.ForEach(n =>
            {
                var documentNode =
                    JsonConvert.DeserializeObject<PatientChartNode>(n.PatientChartDocumentNodeJsonString);

                documentNode.ParentId = rootNodeId;

                rootNode.Children.Add(documentNode);
            });

            rootNode.Children =
                rootNode.Children.OrderBy(n => n.Attributes.Order)
                    .ToList();

            return rootNode;
        }

        public async Task<PatientChartNode> Update(PatientChartVm patientChartVm)
        {
            var patientChart = patientChartVm.PatientChart;
            var companyId = patientChartVm.CompanyId;

            var patientChartDocumentNodes =
                GetPatientChartDocumentNodes(patientChart).ToList();

            var existedPatientChartDocumentNodesQuery =
                _patientChartDocumentNodeRepository.GetAll();

            if (companyId == null)
                existedPatientChartDocumentNodesQuery = existedPatientChartDocumentNodesQuery
                    .Where(d => d.CompanyId == null);
            else
                existedPatientChartDocumentNodesQuery = existedPatientChartDocumentNodesQuery
                    .Where(d => d.CompanyId == companyId.Value);

            var existedPatientChartDocumentNodes =
                await existedPatientChartDocumentNodesQuery
                    .Include(d => d.LibraryPatientChartDocumentNodes)
                    .ToListAsync();

            var deletedDocuments =
                GetDeletedDocuments(patientChartDocumentNodes, existedPatientChartDocumentNodes);

            foreach (var deletedDocumentNode in deletedDocuments)
            {
                _patientChartDocumentNodeRepository.Remove(deletedDocumentNode.Id);

                var libraryRelatedPatientChartDocumentNodes
                    = deletedDocumentNode.LibraryPatientChartDocumentNodes;

                if (!libraryRelatedPatientChartDocumentNodes.Any())
                    continue;

                foreach (var relatedPatientChartDocumentNode in libraryRelatedPatientChartDocumentNodes)
                {
                    relatedPatientChartDocumentNode.LibraryPatientChartDocumentNodeId = null;
                    relatedPatientChartDocumentNode.Version = null;
                }
            }

            foreach (var patientChartDocumentNode in patientChartDocumentNodes)
            {
                var patientChartDocumentNodeId = patientChartDocumentNode.Id;

                var existedPatientChartDocumentNode = existedPatientChartDocumentNodes
                    .FirstOrDefault(node => node.Id == patientChartDocumentNodeId);

                if (existedPatientChartDocumentNode == null)
                    AddNewPatientChartDocumentNode(patientChartDocumentNode, companyId);
                else
                    UpdatePatientChartDocumentNode(patientChartDocumentNode,
                        existedPatientChartDocumentNode, companyId, patientChartVm.PatientChartDocumentId);
            }

            await _unitOfWork.Commit();

            return patientChart;
        }

        private static IEnumerable<PatientChartNode> GetPatientChartDocumentNodes(PatientChartNode patientChart)
        {
            var patientChartChildrenNodes = patientChart.Children;
            var isAllPatientChartChildrenNodesOfDocumentNodeType =
                patientChartChildrenNodes.All(node => node.Type == PatientChartNodeType.DocumentNode);

            if (!isAllPatientChartChildrenNodesOfDocumentNodeType)
                throw new InvalidOperationException("Patient chart has to contain only document nodes");

            return patientChartChildrenNodes;
        }

        private static IEnumerable<PatientChartDocumentNode> GetDeletedDocuments(
            IList<PatientChartNode> newDocumentNodes,
            IEnumerable<PatientChartDocumentNode> existedDocumentNodes)
        {
            foreach (var existedDocumentNode in existedDocumentNodes)
            {
                var isDocumentDeleted =
                    newDocumentNodes.FirstOrDefault(newDocumentNode => newDocumentNode.Id == existedDocumentNode.Id) ==
                    null;

                if (isDocumentDeleted)
                    yield return existedDocumentNode;
            }
        }

        private void AddNewPatientChartDocumentNode(PatientChartNode patientChartDocumentNode, Guid? companyId)
        {
            var newPatientChartDocumentNode = new PatientChartDocumentNode
            {
                Id = patientChartDocumentNode.Id,
                Title = patientChartDocumentNode.Title,
                Name = patientChartDocumentNode.Name,
                Version = companyId == null ? (int?) 1 : null,
                CompanyId = companyId,
                PatientChartDocumentNodeJsonString =
                    JsonConvert.SerializeObject(patientChartDocumentNode, _jsonSerializerSettings)
            };

            _patientChartDocumentNodeRepository.Add(newPatientChartDocumentNode);
        }

        private void UpdatePatientChartDocumentNode(PatientChartNode patientChartNode,
            PatientChartDocumentNode patientChartDocumentNode,
            Guid? companyId,
            Guid? patientChartDocumentId = null)
        {
            patientChartDocumentNode.Name = patientChartNode.Name;
            patientChartDocumentNode.Title = patientChartNode.Title;
            patientChartDocumentNode.PatientChartDocumentNodeJsonString =
                JsonConvert.SerializeObject(patientChartNode, _jsonSerializerSettings);

            var isVersionUpdateNeeded = !companyId.HasValue && patientChartDocumentId.HasValue;
            if (isVersionUpdateNeeded)
                patientChartDocumentNode.Version += 1;
        }
    }
}