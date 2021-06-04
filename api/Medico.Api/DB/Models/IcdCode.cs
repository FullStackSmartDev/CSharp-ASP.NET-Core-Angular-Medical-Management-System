using System;
using System.Collections.Generic;

namespace Medico.Api.DB.Models
{
    public class IcdCode
    {
        public Guid Id { get; set; }

        public string Code { get; set; }

        public string Name { get; set; }

        public string Notes { get; set; }

        public List<KeywordIcdCode> KeywordIcdCodes { get; set; }
    }
}