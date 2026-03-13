using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SupportFlow.API.Common;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;

[ApiController]
[Route("api/presence")]
[Authorize]
public class PresenceController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUser;

    public PresenceController(IUnitOfWork unitOfWork, ICurrentUserService currentUser)
    {
        _unitOfWork = unitOfWork;
        _currentUser = currentUser;
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        var userId = _currentUser.UserId;
        var user = await _unitOfWork.Repository<User>().GetByIdAsync(userId);

        if (user == null)
            return NotFound();

        return Ok(new
        {
            user.AvailabilityStatus,
            user.IsOnline,
            user.LastActivityTime
        });
    }

    [HttpPut("status")]
    public async Task<IActionResult> UpdateStatus([FromBody] UpdateStatusDto dto)
    {
        var userId = _currentUser.UserId;
        var repo = _unitOfWork.Repository<User>();
        var user = await repo.GetByIdAsync(userId);

        if (user == null)
            return NotFound();

        // ✅ Validate allowed statuses
        var allowedStatuses = new[]
        {
            "Available", "Busy", "Do Not Disturb",
            "Be Right Back", "Appear Away", "Offline"
        };

        if (!allowedStatuses.Contains(dto.Status))
            return BadRequest(new { message = "Invalid status value" });

        user.AvailabilityStatus = dto.Status;
        user.IsOnline = dto.Status != "Offline";
        user.LastActivityTime = DateTime.UtcNow;

        repo.Update(user);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { message = "Status updated successfully" });
    }
}

// ✅ DTO for request body
public class UpdateStatusDto
{
    public string Status { get; set; }
}
//public class PresenceController : ControllerBase
//{
//    private readonly IUnitOfWork _unitOfWork;
//    private readonly ICurrentUserService _currentUser;

//    public PresenceController(IUnitOfWork unitOfWork, ICurrentUserService currentUser)
//    {
//        _unitOfWork = unitOfWork;
//        _currentUser = currentUser;
//    }

//    [HttpGet("status")]
//    public async Task<IActionResult> GetStatus()
//    {
//        var userId = _currentUser.UserId;

//        var user = await _unitOfWork.Repository<User>().GetByIdAsync(userId);

//        return Ok(new
//        {
//            user.AvailabilityStatus,
//            user.IsOnline,
//            user.LastActivityTime
//        });
//    }

//    [HttpPut("status")]
//    public async Task<IActionResult> UpdateStatus(string status)
//    {
//        var userId = _currentUser.UserId;

//        var repo = _unitOfWork.Repository<User>();
//        var user = await repo.GetByIdAsync(userId);

//        user.AvailabilityStatus = status;
//        user.LastActivityTime = DateTime.UtcNow;

//        repo.Update(user);
//        await _unitOfWork.SaveChangesAsync();

//        return Ok();
//    }
//}