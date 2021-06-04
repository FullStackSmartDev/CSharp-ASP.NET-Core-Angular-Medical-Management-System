using System.Collections.Generic;

namespace Medico.Api.Dto
{
    public class DevExtremeGridResultDto<T> where T: class
    {
        public List<T> Data { get; set; }

        public int TotalCount { get; set; }
    }
}
