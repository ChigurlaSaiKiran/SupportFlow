using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SupportFlow.Application.DTOs.WorkLogs;
using SupportFlow.Application.Interfaces;

namespace SupportFlow.API.Controllers;

[ApiController]
[Route("api/worklogs")]
[Authorize]
public class WorkLogController : ControllerBase
{
    private readonly IWorkLogService _service;

    public WorkLogController(IWorkLogService service)
    {
        _service = service;
    }

    // Admin / HR — see all logs
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    // Employee — see my logs
    [HttpGet("my/{userId}")]
    public async Task<IActionResult> GetMyLogs(int userId)
        => Ok(await _service.GetByUserIdAsync(userId));

    // Manager — see pending approvals
    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
        => Ok(await _service.GetPendingApprovalsAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var log = await _service.GetByIdAsync(id);
        if (log == null) return NotFound();
        return Ok(log);
    }

    // Employee submits work log
    [HttpPost]
    public async Task<IActionResult> Create(CreateWorkLogDto dto)
    {
        await _service.CreateAsync(dto);
        return Ok("Work log submitted successfully");
    }

    // Employee updates their log
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateWorkLogDto dto)
    {
        await _service.UpdateAsync(id, dto);
        return Ok("Work log updated successfully");
    }

    // Manager approves or rejects
    [HttpPut("{id}/approve")]
    public async Task<IActionResult> Approve(int id, ApproveWorkLogDto dto)
    {
        await _service.ApproveAsync(id, dto);
        return Ok("Work log approval updated");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);
        return Ok("Work log deleted");
    }
}