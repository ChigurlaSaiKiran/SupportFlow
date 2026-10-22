using SupportFlow.Application.DTOs.WorkLogs;

namespace SupportFlow.Application.Interfaces;

public interface IWorkLogService
{
    Task<IEnumerable<WorkLogResponseDto>> GetAllAsync();
    Task<IEnumerable<WorkLogResponseDto>> GetByUserIdAsync(int userId);
    Task<IEnumerable<WorkLogResponseDto>> GetPendingApprovalsAsync();
    Task<WorkLogResponseDto?> GetByIdAsync(int id);
    Task CreateAsync(CreateWorkLogDto dto);
    Task UpdateAsync(int id, UpdateWorkLogDto dto);
    Task ApproveAsync(int id, ApproveWorkLogDto dto);
    Task DeleteAsync(int id);
}