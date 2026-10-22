namespace SupportFlow.Application.DTOs.Attendance;

public class CheckOutDto
{
    public DateTime CheckOutTime { get; set; } = DateTime.UtcNow;
}