using Microsoft.EntityFrameworkCore;
using SupportFlow.Application.DTOs.TicketAttachments;
using SupportFlow.Application.DTOs.Tickets;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SupportFlow.Infrastructure.Services
{
    public class TicketService : ITicketService
    {
        private readonly IGenericRepository<Ticket> _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentUserService _currentUser; // ✅ ADD THIS
        public TicketService(
            IGenericRepository<Ticket> repository,
            IUnitOfWork unitOfWork, ICurrentUserService currentUser
            )
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
            _currentUser = currentUser; // ✅ ADD THIS
        }

        // -------- BASIC CRUD --------

        //public async Task<IEnumerable<Ticket>> GetAllAsync()
        //    => await _repository.GetAllAsync();
        public async Task<IEnumerable<Ticket>> GetAllAsync()
        {
            var baseCount = await _repository.Query().CountAsync();

            var data = await _repository.Query()
                .AsNoTracking()
                .Include(t => t.Status)
                .Include(t => t.Priority)
                .Include(t => t.Category)
                .Include(t => t.Department)
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedTo)
                .ToListAsync();

            return data;
        }
        public async Task<Ticket> GetByIdAsync(int id)
        {
            return await _repository.Query().AsNoTracking()
                .Include(t => t.Status)
                .Include(t => t.Priority)
                .Include(t => t.Category)
                .Include(t => t.Department)
                .Include(t => t.CreatedBy)
                .Include(t => t.AssignedTo)
                .FirstOrDefaultAsync(t => t.Id == id);
        }
        public async Task CreateAsync(Ticket ticket)
        {
            // business defaults
            ticket.StatusId =1; // Always Open on Create
           ticket.CreatedById = _currentUser.UserId; // ✅ reads from JWT token
           // ticket.CreatedById = 1;
            ticket.CreatedDate = DateTime.UtcNow;
            //  ticket.CreatedAt = System.DateTime.UtcNow;

            await _repository.AddAsync(ticket);
            await _unitOfWork.SaveChangesAsync();
        }
        public async Task UpdateAsync(int id, UpdateTicketDto dto)
        {
            // 1. Fetch existing ticket
            var ticket = await _repository.GetByIdAsync(id);

            if (ticket == null)
    throw new KeyNotFoundException($"Ticket with ID {id} not found"); // Better to use custom exception

            // 2. Update scalar properties
            ticket.Title = dto.Title;
            ticket.Description = dto.Description;

            // 3. Update foreign key relations
            // 🔥 STATUS SAFE GUARD
            if (dto.StatusId > 0)
                ticket.StatusId = dto.StatusId;
            //For strict validation use down
           // if (dto.StatusId <= 0)
               // throw new Exception("Invalid StatusId");
            // else keep existing value (very important)
            if (dto.PriorityId > 0)
                ticket.PriorityId = dto.PriorityId;

            if (dto.CategoryId > 0)
                ticket.CategoryId = dto.CategoryId;

            if (dto.DepartmentId > 0)
                ticket.DepartmentId = dto.DepartmentId;
            // ticket.CreatedById = dto.CreatedById;           
            ticket.AssignedToId = dto.AssignedToId;

            // 4. Save changes - use existing repository's Update method
            _repository.Update(ticket); // Assuming this marks as modified
            await _unitOfWork.SaveChangesAsync(); // This actually persists to DB
        }


        //public async Task UpdateAsync(Ticket ticket)
        //{
        //    _repository.Update(ticket);
        //    await _unitOfWork.SaveChangesAsync();
        //}

        public async Task DeleteAsync(int id)
        {
            var ticket = await _repository.GetByIdAsync(id);
            if (ticket == null)
                throw new KeyNotFoundException($"Ticket with ID {id} not found");

            _repository.Delete(ticket);
            await _unitOfWork.SaveChangesAsync();
        }

    }
}
