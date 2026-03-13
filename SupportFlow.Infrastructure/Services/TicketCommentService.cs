using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Infrastructure.Services
{
    public class TicketCommentService : ITicketCommentService
    {
        private readonly IGenericRepository<TicketComment> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public TicketCommentService(
            IGenericRepository<TicketComment> repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }


        public async Task<IEnumerable<TicketComment>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<TicketComment?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task CreateAsync(TicketComment comment)
        {
            await _repository.AddAsync(comment);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(TicketComment comment)
        {
            _repository.Update(comment);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity == null) return;

            _repository.Delete(entity);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
