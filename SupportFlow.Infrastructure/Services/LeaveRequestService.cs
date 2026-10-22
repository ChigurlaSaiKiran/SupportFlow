using Microsoft.EntityFrameworkCore;
using SupportFlow.Application.DTOs.LeaveRequests;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;

namespace SupportFlow.Infrastructure.Services;

public class LeaveRequestService : ILeaveRequestService
{
    private readonly IGenericRepository<LeaveRequest> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUser;

    public LeaveRequestService(
        IGenericRepository<LeaveRequest> repository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUser)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    // Admin sees all
    public async Task<IEnumerable<LeaveRequestResponseDto>> GetAllAsync()
    {
        var requests = await _repository.Query()
            .AsNoTracking()
            .Include(l => l.User)
            .Include(l => l.ApprovedByManager)
            .OrderByDescending(l => l.CreatedDate)
            .ToListAsync();

        return requests.Select(MapToDto);
    }

    // User sees their own
    public async Task<IEnumerable<LeaveRequestResponseDto>> GetByUserIdAsync(int userId)
    {
        var requests = await _repository.Query()
            .AsNoTracking()
            .Include(l => l.User)
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.CreatedDate)
            .ToListAsync();

        return requests.Select(MapToDto);
    }

    // Manager sees pending
    public async Task<IEnumerable<LeaveRequestResponseDto>> GetPendingAsync()
    {
        var requests = await _repository.Query()
            .AsNoTracking()
            .Include(l => l.User)
            .Where(l => l.Status == "Pending")
            .OrderByDescending(l => l.CreatedDate)
            .ToListAsync();

        return requests.Select(MapToDto);
    }

    public async Task<LeaveRequestResponseDto?> GetByIdAsync(int id)
    {
        var request = await _repository.Query()
            .AsNoTracking()
            .Include(l => l.User)
            .Include(l => l.ApprovedByManager)
            .FirstOrDefaultAsync(l => l.Id == id);

        return request == null ? null : MapToDto(request);
    }

    public async Task CreateAsync(CreateLeaveRequestDto dto)
    {
        // Validate dates
        if (dto.FromDate > dto.ToDate)
            throw new InvalidOperationException(
                "From date cannot be after To date");

        var request = new LeaveRequest
        {
            UserId = _currentUser.UserId,
            FromDate = dto.FromDate,
            ToDate = dto.ToDate,
            LeaveType = dto.LeaveType,
            Reason = dto.Reason,
            Status = "Pending",
            CreatedDate = DateTime.UtcNow
        };

        await _repository.AddAsync(request);
        await _unitOfWork.SaveChangesAsync();
    }

    // Admin approves or rejects
    public async Task ApproveAsync(int id, ApproveLeaveRequestDto dto)
    {
        var request = await _repository.GetByIdAsync(id);

        if (request == null)
            throw new KeyNotFoundException(
                $"Leave request {id} not found");

        request.Status = dto.Status;
        request.ManagerComment = dto.ManagerComment;
        request.ApprovedByManagerId = _currentUser.UserId;

        _repository.Update(request);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var request = await _repository.GetByIdAsync(id);

        if (request == null)
            throw new KeyNotFoundException(
                $"Leave request {id} not found");

        // Only pending requests can be deleted
        if (request.Status != "Pending")
            throw new InvalidOperationException(
                "Only pending requests can be deleted");

        _repository.Delete(request);
        await _unitOfWork.SaveChangesAsync();
    }

    private LeaveRequestResponseDto MapToDto(LeaveRequest l) => new()
    {
        Id = l.Id,
        UserId = l.UserId,
        UserFullName = l.User?.FullName ?? "",
        FromDate = l.FromDate,
        ToDate = l.ToDate,
        TotalDays = (l.ToDate - l.FromDate).Days + 1,
        LeaveType = l.LeaveType,
        Reason = l.Reason,
        Status = l.Status,
        ApprovedByManagerId = l.ApprovedByManagerId,
        ApprovedByManagerName = l.ApprovedByManager?.FullName,
        ManagerComment = l.ManagerComment,
        CreatedDate = l.CreatedDate
    };
}