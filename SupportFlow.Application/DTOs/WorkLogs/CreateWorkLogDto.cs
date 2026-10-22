namespace SupportFlow.Application.DTOs.WorkLogs;

public class CreateWorkLogDto
{
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string TaskDescription { get; set; }
    public decimal HoursSpent { get; set; }
    public string TaskStatus { get; set; } = "InProgress";
}