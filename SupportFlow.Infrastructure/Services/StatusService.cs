using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Infrastructure.Services
{
    using SupportFlow.Application.Interfaces;
    using SupportFlow.Domain.Entities;

    public class StatusService : IStatusService
    {
        private readonly IGenericRepository<Status> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public StatusService(
            IGenericRepository<Status> repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Status>> GetAllAsync()
            => await _repository.GetAllAsync();

        public async Task<Status?> GetByIdAsync(int id)
            => await _repository.GetByIdAsync(id);

        public async Task CreateAsync(Status status)
        {
            await _repository.AddAsync(status);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(Status status)
        {
            _repository.Update(status);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return;

            _repository.Delete(entity);
            await _unitOfWork.SaveChangesAsync();
        }
    }

}
