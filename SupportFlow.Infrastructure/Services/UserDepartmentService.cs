using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Infrastructure.Services
{
    public class UserDepartmentService : IUserDepartmentService
    {
        private readonly IGenericRepository<UserDepartment> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public UserDepartmentService(
            IGenericRepository<UserDepartment> repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<UserDepartment>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task CreateAsync(UserDepartment entity)
        {
            await _repository.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteAsync(int userId, int departmentId)
        {
            var data = await _repository.GetAllAsync();

            var entity = data.FirstOrDefault(x =>
                x.UserId == userId && x.DepartmentId == departmentId);

            if (entity == null)
                return;

            _repository.Delete(entity);
            await _unitOfWork.SaveChangesAsync();
        }

        //public async Task DeleteAsync(int userId, int departmentId)
        //{
        //    var entity = await _repository
        //        .FirstOrDefaultAsync(x => x.UserId == userId && x.DepartmentId == departmentId);

        //    if (entity == null) return;

        //    _repository.Remove(entity);
        //    await _unitOfWork.SaveChangesAsync();
        //}
    }

}
