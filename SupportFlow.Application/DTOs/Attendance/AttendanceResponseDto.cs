namespace SupportFlow.Application.DTOs.Attendance;

public class AttendanceResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public DateTime Date { get; set; }
    public DateTime? CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }
    public string Status { get; set; }
    public decimal? TotalHours { get; set; }
}