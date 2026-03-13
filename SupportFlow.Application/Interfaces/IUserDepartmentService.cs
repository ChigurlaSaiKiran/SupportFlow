using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Interfaces
{
    public interface IUserDepartmentService
    {
        Task<IEnumerable<UserDepartment>> GetAllAsync();

        //Task<UserDepartment> GetByIdAsync(int id);
        Task CreateAsync(UserDepartment entity);
        Task DeleteAsync(int userId, int departmentId);
    }

}
