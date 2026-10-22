using SupportFlow.Application.DTOs.Attendance;

namespace SupportFlow.Application.Interfaces;

public interface IAttendanceService
{
    // Get all attendance (Admin)
    Task<IEnumerable<AttendanceResponseDto>> GetAllAsync();

    // Get my attendance (User/Agent)
    Task<IEnumerable<AttendanceResponseDto>> GetByUserIdAsync(int userId);

    // Get today's attendance for user
    Task<AttendanceResponseDto?> GetTodayAsync(int userId);

    // Check In
    Task<AttendanceResponseDto> CheckInAsync(int userId);

    // Check Out
    Task<AttendanceResponseDto> CheckOutAsync(int userId);
}