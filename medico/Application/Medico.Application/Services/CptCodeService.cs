using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Medico.Application.Interfaces;
using Medico.Application.ViewModels;
using Medico.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Medico.Application.Services
{
    public class CptCodeService : ICptCodeService
    {
        private readonly ICptCodeRepository _cptCodeRepository;
        private readonly IMapper _mapper;

        public CptCodeService(ICptCodeRepository cptCodeRepository,
            IMapper mapper)
        {
            _cptCodeRepository = cptCodeRepository;
            _mapper = mapper;
        }

        public IQueryable<CptCodeViewModel> GetAll()
        {
            return _cptCodeRepository.GetAll()
                .ProjectTo<CptCodeViewModel>();
        }

        public async Task<CptCodeViewModel> GetById(Guid id)
        {
            var icdCode = await _cptCodeRepository.GetAll()
                .FirstOrDefaultAsync(c => c.Id == id);

            return icdCode == null
                ? null
                : _mapper.Map<CptCodeViewModel>(icdCode);
        }
    }
}
