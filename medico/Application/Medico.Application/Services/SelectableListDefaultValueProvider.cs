using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.Services.PatientChart;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Medico.Application.Services
{
    public class SimpleDefaultValueProvider : IDefaultValueProvider
    {
        private readonly string _value;

        public SimpleDefaultValueProvider(PatientChartNodeType key, string value)
        {
            _value = value;
            Key = key;
        }

        public PatientChartNodeType Key { get; }

        public Task<string> GetValue()
        {
            return Task.FromResult(_value);
        }
    }

    public class SelectableListDefaultValueProvider : IDefaultValueProvider
    {
        private readonly Guid _librarySelectableListId;
        private readonly ISelectableListRepository _selectableListRepository;

        public SelectableListDefaultValueProvider(PatientChartNodeType key,
            Guid librarySelectableListId, ISelectableListRepository selectableListRepository)
        {
            _librarySelectableListId = librarySelectableListId;
            _selectableListRepository = selectableListRepository;
            Key = key;
        }

        public PatientChartNodeType Key { get; }

        public async Task<string> GetValue()
        {
            var selectableList = await _selectableListRepository.GetAll()
                .Include(l => l.LibrarySelectableList)
                .FirstOrDefaultAsync(l => l.LibrarySelectableList.Id == _librarySelectableListId);

            if (selectableList == null)
                return string.Empty;

            var jsonValues = selectableList.JsonValues;
            if (string.IsNullOrEmpty(jsonValues))
                return string.Empty;

            var selectableListValues = JsonConvert.DeserializeObject<IEnumerable<SelectableListValueViewModel>>(jsonValues);
            var defaultSelectableListValue = selectableListValues
                .FirstOrDefault(v => v.IsDefault);

            return defaultSelectableListValue == null
                ? string.Empty
                : defaultSelectableListValue.Value;
        }
    }
}