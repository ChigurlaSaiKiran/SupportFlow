using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SupportFlow.Application.Interfaces;

namespace SupportFlow.API.Controllers;

[ApiController]
[Route("api/attendance")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _service;
    private readonly ICurrentUserService _currentUser;

    public AttendanceController(
        IAttendanceService service,
        ICurrentUserService currentUser)
    {
        _service = service;
        _currentUser = currentUser;
    }

    // Admin — see all
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    // User — see my records
    [HttpGet("my/{userId}")]
    public async Task<IActionResult> GetMyAttendance(int userId)
        => Ok(await _service.GetByUserIdAsync(userId));

    // Get today's status
    [HttpGet("today/{userId}")]
    public async Task<IActionResult> GetToday(int userId)
    {
        var record = await _service.GetTodayAsync(userId);
        return Ok(record);
    }

    // Check In
    [HttpPost("checkin")]
    public async Task<IActionResult> CheckIn()
    {
        try
        {
            var userId = _currentUser.UserId;
            var result = await _service.CheckInAsync(userId);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // Check Out
    [HttpPost("checkout")]
    public async Task<IActionResult> CheckOut()
    {
        try
        {
            var userId = _currentUser.UserId;
            var result = await _service.CheckOutAsync(userId);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}