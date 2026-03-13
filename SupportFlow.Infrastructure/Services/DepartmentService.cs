using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Infrastructure.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IGenericRepository<Department> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public DepartmentService(
            IGenericRepository<Department> repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Department> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task CreateAsync(Department department)
        {
            await _repository.AddAsync(department);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task UpdateAsync(Department department)
        {
            _repository.Update(department);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var department = await _repository.GetByIdAsync(id);
            if (department == null) return;

            _repository.Delete(department);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
