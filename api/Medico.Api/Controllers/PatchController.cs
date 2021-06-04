using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Medico.Api.DB;
using Medico.Api.DB.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Medico.Api.Controllers
{
    [Route("api/patch")]
    public class PatchController : Controller
    {
        private readonly MedicoContext _medicoContext;

        public PatchController(MedicoContext medicoContext)
        {
            _medicoContext = medicoContext;
        }

        [HttpPost]
        [Route("templates")]
        public async Task<IActionResult> Templates()
        {
            try
            {
                var templates = await _medicoContext
                  .Set<Template>()
                  .Where(t => !string.IsNullOrEmpty(t.Value))
                  .ToListAsync();

                foreach (var template in templates)
                {
                    if (!string.IsNullOrEmpty(template.Value) && template.Value != "undefined")
                    {
                        var templateChunks =
                          JsonConvert.DeserializeObject<TemplateValue>(template.Value);

                        var templateResultStringBuilder = new StringBuilder("<p>");

                        foreach (var templateChunk in templateChunks.TemplateChunks)
                        {
                            if (templateChunk is string str)
                            {
                                templateResultStringBuilder.Append($"{str} ");
                            }

                            if (templateChunk is JObject jObject)
                            {
                                SelectableRange rangeChunk = null;
                                SelectableList listChunk = null;

                                rangeChunk = jObject.ToObject<SelectableRange>();
                                listChunk = jObject.ToObject<SelectableList>();

                                ISelectableItem selectableItem = rangeChunk.NotValid()
                                  ? (ISelectableItem)listChunk
                                  : rangeChunk;
                                templateResultStringBuilder.Append($"{selectableItem.SelectableItemString} ");
                            }
                        }

                        templateResultStringBuilder.Append("</p>");

                        template.DetailedTemplateHtml = templateResultStringBuilder.ToString();

                        template.DefaultTemplateHtml = string.IsNullOrEmpty(templateChunks.DefaultTemplateValue)
                          ? null
                          : $"<p>{templateChunks.DefaultTemplateValue}</p>";
                    }
                }

                await _medicoContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

            return Ok();
        }

        [HttpPost]
        [Route("lookupitems")]
        public async Task<IActionResult> LookupItems()
        {
            var lookupItems = await _medicoContext.Set<TemplateLookupItem>()
              .ToListAsync();

            foreach (var templateLookupItem in lookupItems)
            {
                var jsonValues = templateLookupItem
                  .JsonValues;
                var values = JsonConvert.DeserializeObject<JsonValues>(jsonValues)
                  .Values;
                var lookupItemsResult = new dynamic[values.Length];
                for (int i = 0; i < values.Length; i++)
                {
                    var value = values[i];
                    var isDefault = i == 0;
                    dynamic newLookupItemValue;
                    if (isDefault)
                    {
                        newLookupItemValue = new { Id = Guid.NewGuid(), Description = value, Value = value, IsDefault = true };
                    }
                    else
                    {
                        newLookupItemValue = new { Id = Guid.NewGuid(), Description = value, Value = value };
                    }

                    lookupItemsResult[i] = newLookupItemValue;
                }

                templateLookupItem.JsonValues = JsonConvert
                  .SerializeObject(new { Values = lookupItemsResult });
            }

            await _medicoContext.SaveChangesAsync();

            return Ok(lookupItems);
        }

        [HttpGet]
        [Route("templatelookupitemtracker")]
        public async Task<IActionResult> TemplateLookupItemTracker()
        {
            var templates = await _medicoContext.Set<Template>()
                .ToListAsync();

            foreach (var template in templates)
            {
                var templateGuid = template.Id;
                var detailedTemplateHtmlContent =
                    template.DetailedTemplateHtml;

                var regex = new Regex(">#[a-z,A-Z,_]+\\.[a-z,A-Z,_]+#<");
                var matches = regex.Matches(detailedTemplateHtmlContent);

                var lookupListNames = matches.Select(l =>
                {
                    var lookupListNameNotFormatted = l.Value.Split('.')[1];

                    return new SelectableListMatch()
                    {
                        NotFormattedName = lookupListNameNotFormatted
                    };
                });

                var concurrentDictionary = new ConcurrentDictionary<string, TemplateLookupItemTracker>();

                foreach (var lookupListName in lookupListNames)
                {
                    TemplateLookupItemTracker templateLookupItemTracker = null;
                    var selectableListName = lookupListName.FormattedName;

                    concurrentDictionary
                        .TryGetValue(selectableListName, out templateLookupItemTracker);

                    if (templateLookupItemTracker != null)
                    {
                        templateLookupItemTracker.NumberOfLookupItemsInTemplate += 1;
                    }

                    else
                    {
                        var selectableList = await _medicoContext.Set<TemplateLookupItem>()
                            .FirstOrDefaultAsync(t => t.Name == selectableListName);
                        if (selectableList == null)
                        {
                            continue;
                        }

                        templateLookupItemTracker = new TemplateLookupItemTracker
                        {
                            TemplateLookupItemId = selectableList.Id,
                            NumberOfLookupItemsInTemplate = 1,
                            TemplateId = templateGuid
                        };

                        concurrentDictionary.TryAdd(selectableListName, templateLookupItemTracker);
                        _medicoContext.Set<TemplateLookupItemTracker>()
                            .Add(templateLookupItemTracker);
                    }
                }
            }

            await _medicoContext.SaveChangesAsync();

            return Ok();
        }
    }
}

public class SelectableListMatch
{
    public string NotFormattedName { get; set; }
    public string FormattedName => string.IsNullOrEmpty(NotFormattedName) ? string.Empty : NotFormattedName
        .TrimEnd('<')
        .TrimEnd('#');
}

interface ISelectableItem
{
    string SelectableItemString { get; }
}

class SelectableList : ISelectableItem
{
    public string Table { get; set; }

    public string SelectableItemString => $"<span id='{Guid.NewGuid()}' metadata='#{Table}#'>#{Table}#</span>";

    public bool NotValid()
    {
        return string.IsNullOrEmpty(Table);
    }
}

class SelectableRange : ISelectableItem
{
    public int Min { get; set; }
    public int Max { get; set; }

    public bool NotValid()
    {
        return Min == Max && Min == 0;
    }

    public string SelectableItemString
    {
        get
        {
            var minValue = Min == 0 ? 1 : Min;
            return $"<span id='{Guid.NewGuid()}' metadata='#{minValue}.{Max}#'>#{minValue}.{Max}#</span>";
        }
    }

}

class TemplateValue
{
    public object[] TemplateChunks { get; set; }

    public string DefaultTemplateValue { get; set; }
}

class SelectableItem
{
    public SelectableItem(string value, bool isDefault, bool isDelete)
    {
        Value = value;
        IsDefault = isDefault;
        IsDelete = isDelete;
    }

    public string Value { get; set; }

    public bool IsDefault { get; set; }

    public bool IsDelete { get; set; }
}

class JsonValues
{
    public string[] Values { get; set; }
}

// input - html string 
// 1 - find all selectable list names


