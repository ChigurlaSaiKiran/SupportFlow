namespace SupportFlow.Application.DTOs.LeaveRequests;

public class CreateLeaveRequestDto
{
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string LeaveType { get; set; }
    public string Reason { get; set; }
}