using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SupportFlow.Application.DTOs.TicketAttachments;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Infrastructure.Services
{
    public class TicketAttachmentService : ITicketAttachmentService
    {
        private readonly IGenericRepository<TicketAttachment> _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public TicketAttachmentService(
             IGenericRepository<TicketAttachment> repository,
             IUnitOfWork unitOfWork,
             IMapper mapper)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TicketAttachment>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<TicketAttachment> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }
        //new
        public async Task<IEnumerable<TicketAttachmentResponseDto>> GetByTicketId(int ticketId)
        {
            var data = await _repository.Query()
                .Where(x => x.TicketId == ticketId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TicketAttachmentResponseDto>>(data);
        }

        public async Task CreateAsync(TicketAttachment attachment)
        {
            await _repository.AddAsync(attachment);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(TicketAttachment attachment)
        {
            _repository.Update(attachment);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var attachment = await _repository.GetByIdAsync(id);
            if (attachment == null) return;

            _repository.Delete(attachment);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
