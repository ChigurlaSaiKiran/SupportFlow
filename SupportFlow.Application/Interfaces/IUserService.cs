using SupportFlow.Application.DTOs.Users;
using SupportFlow.Domain.Entities;
using SupportFlow.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllAsync();

        Task<User?> GetByIdAsync(int id);

        Task<User> CreateUserAsync(UserCreateDto dto);

        Task<bool> UpdateAsync(int id, UserUpdateDto dto);

        Task<bool> DeleteAsync(int id);
        // 🔴 REQUIRED FOR LOGIN // ✅ Already exists for login
        Task<User?> LoginAsync(string email, string password);
        // ✅ ADD THIS
        Task<User?> GetByEmailAsync(string email);

        // ✅ ADD THIS
        Task<bool> UpdatePasswordAsync(User user);

        //Task<IEnumerable<User>> GetAllAsync();
        //Task<User?> GetByIdAsync(int id);
        //Task<int> CreateAsync(UserCreateDto dto);
        //Task<bool> UpdateAsync(int id, UserUpdateDto dto);
        //Task<bool> DeleteAsync(int id);
        //Task<User?> LoginAsync(string email, string password);
    }
}
