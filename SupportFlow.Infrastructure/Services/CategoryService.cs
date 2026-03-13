using AutoMapper;
using SupportFlow.Application.DTOs.Category;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Infrastructure.Services
{

    public class CategoryService : ICategoryService
    {
        private readonly IGenericRepository<Category> _repository;
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(
            IGenericRepository<Category> repository,
            IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

        // GET ALL
        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        // GET BY ID
        public async Task<Category> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        // CREATE
        public async Task CreateAsync(Category category)
        {
            await _repository.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();
        }

        // UPDATE
        public async Task UpdateAsync(Category category)
        {
            _repository.Update(category); // ✅ NO UpdateAsync
            await _unitOfWork.SaveChangesAsync();
        }

        // DELETE
        public async Task DeleteAsync(int id)
        {
            var category = await _repository.GetByIdAsync(id);
            if (category == null) return;

            _repository.Delete(category);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
