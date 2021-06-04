using System;
using Newtonsoft.Json;

namespace Medico.Api.Dto
{
    public class IcdCodeKeywordDto
    {
        [JsonProperty("keywordValue")]
        public string KeywordValue { get; set; }

        [JsonProperty("icdCodeId")]
        public Guid IcdCodeId { get; set; }
    }
}
