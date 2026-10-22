namespace SupportFlow.Application.DTOs.LeaveRequests;

public class ApproveLeaveRequestDto
{
    // Approved / Rejected
    public string Status { get; set; }
    public string? ManagerComment { get; set; }
}