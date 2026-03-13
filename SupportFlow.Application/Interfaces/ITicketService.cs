using SupportFlow.Application.DTOs.Tickets;
using SupportFlow.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SupportFlow.Application.Interfaces
{
    public interface ITicketService
    {
        Task<IEnumerable<Ticket>> GetAllAsync();
        Task<Ticket> GetByIdAsync(int id);
        Task CreateAsync(Ticket ticket);
        Task UpdateAsync(int id, UpdateTicketDto dto); // Changed signature
        Task DeleteAsync(int id);

        // ✅ NEW
    //    Task<PagedResult<Ticket>> GetPagedAsync(
    //        int pageNumber,
    //        int pageSize,
    //        string? search);
    }
}
