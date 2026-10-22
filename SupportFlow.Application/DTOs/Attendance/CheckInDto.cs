namespace SupportFlow.Application.DTOs.Attendance;

public class CheckInDto
{
    public DateTime CheckInTime { get; set; } = DateTime.UtcNow;
}