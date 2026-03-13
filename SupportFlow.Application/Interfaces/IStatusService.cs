using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Interfaces
{
    public interface IStatusService
    {
        Task<IEnumerable<Status>> GetAllAsync();
        Task<Status?> GetByIdAsync(int id);
        Task CreateAsync(Status status);
        Task UpdateAsync(Status status);
        Task DeleteAsync(int id);
    }
}
