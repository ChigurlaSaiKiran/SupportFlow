using SupportFlow.Application.DTOs.TicketAttachments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Interfaces
{
    public interface ITicketAttachmentService
    {
        Task<IEnumerable<TicketAttachment>> GetAllAsync();
        Task<TicketAttachment> GetByIdAsync(int id);
        Task CreateAsync(TicketAttachment attachment);
        Task UpdateAsync(TicketAttachment attachment);
        Task DeleteAsync(int id);

        // ⭐ ADD THIS
        Task<IEnumerable<TicketAttachmentResponseDto>> GetByTicketId(int ticketId);
    }
}
