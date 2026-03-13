using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Interfaces
{
    public interface IPriorityService
    {
        Task<IEnumerable<Priority>> GetAllAsync();
        Task<Priority?> GetByIdAsync(int id);
        Task CreateAsync(Priority priority);
        Task UpdateAsync(Priority priority);
        Task DeleteAsync(int id);
    }
}
