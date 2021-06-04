using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Medico.Application.Interfaces;
using Medico.Domain.Interfaces;
using Medico.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class TemplateSelectableListService : ITemplateSelectableListService
    {
        private readonly IMapper _mapper;
        private readonly ITemplateSelectableListRepository _templateSelectableListRepository;
        private readonly ITemplateRepository _templateRepository;
        private readonly ISelectableListRepository _selectableListRepository;
        private readonly IUnitOfWork _unitOfWork;

        public TemplateSelectableListService(IMapper mapper,
            ITemplateSelectableListRepository templateSelectableListRepository,
            ITemplateRepository templateRepository,
            ISelectableListRepository selectableListRepository,
            IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _templateSelectableListRepository = templateSelectableListRepository;
            _templateRepository = templateRepository;
            _selectableListRepository = selectableListRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task AddToCompanyFromLibrary(IDictionary<Guid, Guid> templatesMap, IDictionary<Guid, Guid> selectableListsMap)
        {
            var libraryTemplateIds = templatesMap.Keys;
            var libraryTemplateSelectableLists = await _templateSelectableListRepository
                .GetAll()
                .Where(tsl => libraryTemplateIds.Contains(tsl.TemplateId))
                .ToListAsync();

            foreach (var libraryTemplateSelectableList in libraryTemplateSelectableLists)
            {
                var companyTemplateSelectableList = new TemplateSelectableList
                {
                    TemplateId = templatesMap[libraryTemplateSelectableList.TemplateId],
                    SelectableListId = selectableListsMap[libraryTemplateSelectableList.SelectableListId]
                };

                _templateSelectableListRepository.Add(companyTemplateSelectableList);
            }
        }
    }
}
