using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Medico.Application.Interfaces;

namespace Medico.Application.Services
{
    public class TemplateContentService : ITemplateContentService
    {
        public string SetDefaultValuesForSelectableHtmlElements(string detailedTemplateContent,
            out IList<Guid> selectableListsIds)
        {
            //            var detailedContentContainerId = Guid.NewGuid();
            //            var htmlDocument =
            //                $@"<!doctype html>
            //                    <html>
            //                    <body>
            //                        <div id=""{detailedContentContainerId}"">{detailedTemplateContent}</div>
            //                    </body>
            //                    </html>";
            //
            //            var document = Html.ParseDocument(htmlDocument);
            //            var selectableElements = document
            //                .QueryElements("label[selectable-type]")
            //                .ToList();
            //
            //            if (!selectableElements.Any())
            //            {
            //                selectableListsIds = new List<Guid>();
            //                return detailedTemplateContent;
            //            }
            //
            //            foreach (var selectableElement in selectableElements)
            //            {
            //                var selectableElementDefaultValue = selectableElement
            //                    .Attributes.FirstOrDefault(a => a.Name == "")
            //            }

            selectableListsIds = new List<Guid>();
            return "test";
        }
    }
}
