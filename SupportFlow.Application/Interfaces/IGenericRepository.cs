using System.Collections.Generic;
using System.Threading.Tasks;

namespace SupportFlow.Application.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(int id);
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);

        // ✅ ADD THIS
        IQueryable<T> Query();
    }
}
