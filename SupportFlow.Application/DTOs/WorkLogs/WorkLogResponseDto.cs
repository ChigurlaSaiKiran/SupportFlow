namespace SupportFlow.Application.DTOs.WorkLogs;

public class WorkLogResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public DateTime Date { get; set; }
    public string TaskDescription { get; set; }
    public decimal HoursSpent { get; set; }
    public string TaskStatus { get; set; }
    public string ApprovalStatus { get; set; }
    public string? ManagerComment { get; set; }
    public int? ApprovedByManagerId { get; set; }
    public string? ApprovedByManagerName { get; set; }
    public DateTime CreatedDate { get; set; }
}