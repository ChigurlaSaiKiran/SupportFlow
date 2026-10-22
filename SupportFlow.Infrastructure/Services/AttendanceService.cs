using Microsoft.EntityFrameworkCore;
using SupportFlow.Application.DTOs.Attendance;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;

namespace SupportFlow.Infrastructure.Services;

public class AttendanceService : IAttendanceService
{
    private readonly IGenericRepository<Attendance> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public AttendanceService(
        IGenericRepository<Attendance> repository,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }
    // Admin sees all
    public async Task<IEnumerable<AttendanceResponseDto>> GetAllAsync()
    {
        var records = await _repository.Query()
            .AsNoTracking()
            .Include(a => a.User)
            .OrderByDescending(a => a.Date)
            .ToListAsync();

        return records.Select(MapToDto);
    }

    // User sees their own
    public async Task<IEnumerable<AttendanceResponseDto>> GetByUserIdAsync(int userId)
    {
        var records = await _repository.Query()
            .AsNoTracking()
            .Include(a => a.User)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.Date)
            .ToListAsync();

        return records.Select(MapToDto);
    }

    // Get today's record for user
    public async Task<AttendanceResponseDto?> GetTodayAsync(int userId)
    {
        var today = DateTime.UtcNow.Date;

        var record = await _repository.Query()
            .AsNoTracking()
            .Include(a => a.User)
            .FirstOrDefaultAsync(a =>
                a.UserId == userId &&
                a.Date == today);

        return record == null ? null : MapToDto(record);
    }

    // Check In
    public async Task<AttendanceResponseDto> CheckInAsync(int userId)
    {
        var today = DateTime.UtcNow.Date;

        // Check if already checked in today
        var existing = await _repository.Query()
            .FirstOrDefaultAsync(a =>
                a.UserId == userId &&
                a.Date == today);

        if (existing != null)
            throw new InvalidOperationException(
                "You have already checked in today");

        var now = DateTime.UtcNow;

        // Late if after 9:30 AM
        var isLate = now.TimeOfDay > new TimeSpan(9, 30, 0);

        var attendance = new Attendance
        {
            UserId = userId,
            Date = today,
            CheckInTime = now,
            Status = isLate ? "Late" : "Present",
            CreatedDate = now
        };

        await _repository.AddAsync(attendance);
        await _unitOfWork.SaveChangesAsync();

        // Reload with user
        var saved = await _repository.Query()
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == attendance.Id);

        return MapToDto(saved!);
    }

    // Check Out
    public async Task<AttendanceResponseDto> CheckOutAsync(int userId)
    {
        var today = DateTime.UtcNow.Date;

        var attendance = await _repository.Query()
            .FirstOrDefaultAsync(a =>
                a.UserId == userId &&
                a.Date == today);

        if (attendance == null)
            throw new InvalidOperationException(
                "You have not checked in today");

        if (attendance.CheckOutTime != null)
            throw new InvalidOperationException(
                "You have already checked out today");

        var now = DateTime.UtcNow;
        attendance.CheckOutTime = now;

        // Calculate total hours
        if (attendance.CheckInTime.HasValue)
        {
            var duration = now - attendance.CheckInTime.Value;
            attendance.TotalHours = (decimal)duration.TotalHours;
        }

        _repository.Update(attendance);
        await _unitOfWork.SaveChangesAsync();

        // Reload with user
        var saved = await _repository.Query()
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == attendance.Id);

        return MapToDto(saved!);
    }

    private AttendanceResponseDto MapToDto(Attendance a) => new()
    {
        Id = a.Id,
        UserId = a.UserId,
        UserFullName = a.User?.FullName ?? "",
        Date = a.Date,
        CheckInTime = a.CheckInTime,
        CheckOutTime = a.CheckOutTime,
        Status = a.Status,
        TotalHours = a.TotalHours
    };
}