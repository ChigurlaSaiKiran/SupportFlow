using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SupportFlow.Application.DTOs.LeaveRequests;
using SupportFlow.Application.Interfaces;

namespace SupportFlow.API.Controllers;

[ApiController]
[Route("api/leaverequests")]
[Authorize]
public class LeaveRequestController : ControllerBase
{
    private readonly ILeaveRequestService _service;

    public LeaveRequestController(ILeaveRequestService service)
    {
        _service = service;
    }

    // Admin sees all
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    // User sees their own
    [HttpGet("my/{userId}")]
    public async Task<IActionResult> GetMyRequests(int userId)
        => Ok(await _service.GetByUserIdAsync(userId));

    // Pending requests
    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
        => Ok(await _service.GetPendingAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var request = await _service.GetByIdAsync(id);
        if (request == null) return NotFound();
        return Ok(request);
    }

    // Employee applies leave
    [HttpPost]
    public async Task<IActionResult> Create(CreateLeaveRequestDto dto)
    {
        try
        {
            await _service.CreateAsync(dto);
            return Ok("Leave request submitted successfully");
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // Admin approves or rejects
    [HttpPut("{id}/approve")]
    public async Task<IActionResult> Approve(
        int id, ApproveLeaveRequestDto dto)
    {
        await _service.ApproveAsync(id, dto);
        return Ok("Leave request updated successfully");
    }

    // Employee deletes pending request
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _service.DeleteAsync(id);
            return Ok("Leave request deleted");
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}