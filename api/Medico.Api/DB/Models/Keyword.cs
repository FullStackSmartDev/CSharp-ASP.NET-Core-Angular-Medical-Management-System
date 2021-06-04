using System;
using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class Keyword
    {
        public Guid Id { get; set; }

        public string Value { get; set; }

        public List<KeywordIcdCode> KeywordIcdCodes { get; set; }
    }

    public class KeywordIcdCode
    {
        public Guid KeywordId { get; set; }

        public Keyword Keyword { get; set; }

        public Guid IcdCodeId { get; set; }

        public IcdCode IcdCode { get; set; }
    }

    public class IcdCodeKeywordsView
    {
        public Guid IcdCodeId { get; set; }

        public string IcdCodeName { get; set; }

        public string IcdCodeDescription { get; set; }

        public string Keywords { get; set; }
    }
}
