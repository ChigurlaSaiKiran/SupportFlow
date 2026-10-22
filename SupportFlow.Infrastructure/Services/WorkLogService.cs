using Microsoft.EntityFrameworkCore;
using SupportFlow.Application.DTOs.WorkLogs;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;

namespace SupportFlow.Infrastructure.Services;

public class WorkLogService : IWorkLogService
{
    private readonly IGenericRepository<WorkLog> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUser;

    public WorkLogService(
        IGenericRepository<WorkLog> repository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUser)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    // Get all work logs (Admin / HR)
    public async Task<IEnumerable<WorkLogResponseDto>> GetAllAsync()
    {
        var logs = await _repository.Query()
            .AsNoTracking()
            .Include(w => w.User)
            .Include(w => w.ApprovedByManager)
            .OrderByDescending(w => w.Date)
            .ToListAsync();

        return logs.Select(MapToDto);
    }

    // Get work logs for a specific employee
    public async Task<IEnumerable<WorkLogResponseDto>> GetByUserIdAsync(int userId)
    {
        var logs = await _repository.Query()
            .AsNoTracking()
            .Include(w => w.User)
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.Date)
            .ToListAsync();

        return logs.Select(MapToDto);
    }

    // Get pending approvals (Manager sees these)
    public async Task<IEnumerable<WorkLogResponseDto>> GetPendingApprovalsAsync()
    {
        var logs = await _repository.Query()
            .AsNoTracking()
            .Include(w => w.User)
            .Where(w => w.ApprovalStatus == "Pending")
            .OrderByDescending(w => w.Date)
            .ToListAsync();

        return logs.Select(MapToDto);
    }

    public async Task<WorkLogResponseDto?> GetByIdAsync(int id)
    {
        var log = await _repository.Query()
            .AsNoTracking()
            .Include(w => w.User)
            .Include(w => w.ApprovedByManager)
            .FirstOrDefaultAsync(w => w.Id == id);

        return log == null ? null : MapToDto(log);
    }

    public async Task CreateAsync(CreateWorkLogDto dto)
    {
        var log = new WorkLog
        {
            UserId = _currentUser.UserId,
            Date = dto.Date,
            TaskDescription = dto.TaskDescription,
            HoursSpent = dto.HoursSpent,
            TaskStatus = dto.TaskStatus,
            ApprovalStatus = "Pending",
            CreatedDate = DateTime.UtcNow
        };

        await _repository.AddAsync(log);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateAsync(int id, UpdateWorkLogDto dto)
    {
        var log = await _repository.GetByIdAsync(id);

        if (log == null)
            throw new KeyNotFoundException($"WorkLog {id} not found");

        log.TaskDescription = dto.TaskDescription;
        log.HoursSpent = dto.HoursSpent;
        log.TaskStatus = dto.TaskStatus;

        _repository.Update(log);
        await _unitOfWork.SaveChangesAsync();
    }

    // Manager approves or rejects
    public async Task ApproveAsync(int id, ApproveWorkLogDto dto)
    {
        var log = await _repository.GetByIdAsync(id);

        if (log == null)
            throw new KeyNotFoundException($"WorkLog {id} not found");

        log.ApprovalStatus = dto.ApprovalStatus;
        log.ManagerComment = dto.ManagerComment;
        log.ApprovedByManagerId = _currentUser.UserId;

        _repository.Update(log);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var log = await _repository.GetByIdAsync(id);

        if (log == null)
            throw new KeyNotFoundException($"WorkLog {id} not found");

        _repository.Delete(log);
        await _unitOfWork.SaveChangesAsync();
    }

    private WorkLogResponseDto MapToDto(WorkLog w) => new()
    {
        Id = w.Id,
        UserId = w.UserId,
        UserFullName = w.User?.FullName ?? "",
        Date = w.Date,
        TaskDescription = w.TaskDescription,
        HoursSpent = w.HoursSpent,
        TaskStatus = w.TaskStatus,
        ApprovalStatus = w.ApprovalStatus,
        ManagerComment = w.ManagerComment,
        ApprovedByManagerId = w.ApprovedByManagerId,
        ApprovedByManagerName = null
    };
}