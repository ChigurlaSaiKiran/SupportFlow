using SupportFlow.Application.DTOs.LeaveRequests;

namespace SupportFlow.Application.Interfaces;

public interface ILeaveRequestService
{
    Task<IEnumerable<LeaveRequestResponseDto>> GetAllAsync();
    Task<IEnumerable<LeaveRequestResponseDto>> GetByUserIdAsync(int userId);
    Task<IEnumerable<LeaveRequestResponseDto>> GetPendingAsync();
    Task<LeaveRequestResponseDto?> GetByIdAsync(int id);
    Task CreateAsync(CreateLeaveRequestDto dto);
    Task ApproveAsync(int id, ApproveLeaveRequestDto dto);
    Task DeleteAsync(int id);
}