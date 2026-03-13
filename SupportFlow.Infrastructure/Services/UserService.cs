using Microsoft.EntityFrameworkCore;
using SupportFlow.Application.DTOs.Users;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;

namespace SupportFlow.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly IGenericRepository<User> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public UserService(
            IGenericRepository<User> repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        // ================= GET ALL =================

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _repository.Query()
                .Include(u => u.Role)
                .AsNoTracking()
                .ToListAsync();
        }

        // ================= GET BY ID =================

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _repository.Query()
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        // ================= CREATE =================

        public async Task<User> CreateUserAsync(UserCreateDto dto)
        {
            // ✅ Check if email already exists
            var existing = await _repository.Query()
                .FirstOrDefaultAsync(u => u.Email == dto.Email.Trim().ToLower());

            if (existing != null)
                throw new InvalidOperationException("Email is already registered.");

            var user = new User
            {
                FullName = dto.FullName.Trim(),
                Email = dto.Email.Trim().ToLower(),

                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),

                RoleId = dto.RoleId,
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            };

            await _repository.AddAsync(user);
            // 🔴 VERY IMPORTANT
            await _unitOfWork.SaveChangesAsync();

            return user;
        }

        // ================= UPDATE =================

        public async Task<bool> UpdateAsync(int id, UserUpdateDto dto)
        {
            var user = await _repository.GetByIdAsync(id);

            if (user == null)
                return false;

            user.FullName = dto.FullName.Trim();
            user.Email = dto.Email.Trim().ToLower();
            user.RoleId = dto.RoleId;
            user.IsActive = dto.IsActive;

            if (!string.IsNullOrEmpty(dto.Password))
            {
                user.PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            _repository.Update(user);

            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        // ================= DELETE =================

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _repository.GetByIdAsync(id);

            if (user == null)
                return false;

            _repository.Delete(user);

            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        // ================= LOGIN =================

        public async Task<User?> LoginAsync(string email, string password)
        {
            email = email.Trim().ToLower();

            var user = await _repository.Query()
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

            if (user == null)
                return null;

            bool validPassword =
                BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);

            if (!validPassword)
                return null;

            if (!user.IsActive)
                return null;

            return user;
        }
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _repository.Query()
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<bool> UpdatePasswordAsync(User user)
        {
            _repository.Update(user);

            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}