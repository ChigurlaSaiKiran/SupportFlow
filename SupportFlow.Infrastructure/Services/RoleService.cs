using SupportFlow.Application.DTOs.Roles;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Infrastructure.Services
{
    public class RoleService : IRoleService
    {
        private readonly IGenericRepository<Role> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public RoleService(
            IGenericRepository<Role> repository, 
            IUnitOfWork unitOfWork)
        {
              _repository = repository;
         _unitOfWork = unitOfWork;
        }

        // Get All Roles
        public async Task<IEnumerable<RoleDto>> GetAllAsync()
        {
            var roles = await _repository.GetAllAsync();

            return roles.Select(r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name
            });
        }

        // Get Role By Id
        public async Task<RoleDto?> GetByIdAsync(int id)
        {
            var role = await _repository.GetByIdAsync(id);

            if (role == null)
                return null;

            return new RoleDto
            {
                Id = role.Id,
                Name = role.Name
            };
        }

        // Create Role
        public async Task<int> CreateAsync(CreateRoleDto dto)
        {
            var role = new Role
            {
                Name = dto.Name
            };

            await _repository.AddAsync(role);
            await _unitOfWork.SaveChangesAsync();

            return role.Id;
        }

        // Update Role
        public async Task<bool> UpdateAsync(int id, UpdateRoleDto dto)
        {
            var role = await _repository.GetByIdAsync(id);

            if (role == null)
                return false;

            role.Name = dto.Name;

            _repository.Update(role);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        // Delete Role
        public async Task<bool> DeleteAsync(int id)
        {
            var role = await _repository.GetByIdAsync(id);

            if (role == null)
                return false;

             _repository.Delete(role);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}
