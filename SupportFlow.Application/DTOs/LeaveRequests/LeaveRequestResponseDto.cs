namespace SupportFlow.Application.DTOs.LeaveRequests;

public class LeaveRequestResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int TotalDays { get; set; }
    public string LeaveType { get; set; }
    public string Reason { get; set; }
    public string Status { get; set; }
    public int? ApprovedByManagerId { get; set; }
    public string? ApprovedByManagerName { get; set; }
    public string? ManagerComment { get; set; }
    public DateTime CreatedDate { get; set; }
}