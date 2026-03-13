using SupportFlow.Application.DTOs.Roles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Interfaces
{
    public interface IRoleService
    {
        Task<IEnumerable<RoleDto>> GetAllAsync();

        Task<RoleDto?> GetByIdAsync(int id);

        Task<int> CreateAsync(CreateRoleDto dto);

        Task<bool> UpdateAsync(int id, UpdateRoleDto dto);

        Task<bool> DeleteAsync(int id);
    }
}
