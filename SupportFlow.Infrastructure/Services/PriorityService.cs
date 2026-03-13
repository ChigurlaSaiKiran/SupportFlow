using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;

public class PriorityService : IPriorityService
{
    private readonly IGenericRepository<Priority> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public PriorityService(
        IGenericRepository<Priority> repository,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<Priority>> GetAllAsync()
        => await _repository.GetAllAsync();

    public async Task<Priority?> GetByIdAsync(int id)
        => await _repository.GetByIdAsync(id);

    public async Task CreateAsync(Priority priority)
    {
        await _repository.AddAsync(priority);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateAsync(Priority priority)
    {
        _repository.Update(priority);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        if (entity == null) return;

        _repository.Delete(entity);
        await _unitOfWork.SaveChangesAsync();
    }
}
