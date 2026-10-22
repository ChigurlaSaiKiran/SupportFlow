namespace SupportFlow.Application.DTOs.WorkLogs;

public class ApproveWorkLogDto
{
    // Approved / Rejected
    public string ApprovalStatus { get; set; }
    public string? ManagerComment { get; set; }
}