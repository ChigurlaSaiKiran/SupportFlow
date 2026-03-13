using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Interfaces
{
    public interface ITicketCommentService
    {
        Task<IEnumerable<TicketComment>> GetAllAsync();
        Task<TicketComment?> GetByIdAsync(int id);
        Task CreateAsync(TicketComment comment);
        Task UpdateAsync(TicketComment comment);
        Task DeleteAsync(int id);
    }
}
