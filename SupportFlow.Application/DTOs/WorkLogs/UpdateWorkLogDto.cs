namespace SupportFlow.Application.DTOs.WorkLogs;

public class UpdateWorkLogDto
{
    public string TaskDescription { get; set; }
    public decimal HoursSpent { get; set; }
    public string TaskStatus { get; set; }
}