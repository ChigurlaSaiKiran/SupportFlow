using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SupportFlow.Application.DTOs.Statuses;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;

namespace SupportFlow.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class StatusesController : ControllerBase
    {
        private readonly IStatusService _priorityservice;
        private readonly IMapper _mapper;

        public StatusesController(IStatusService service, IMapper mapper)
        {
            _priorityservice = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _priorityservice.GetAllAsync();
            return Ok(_mapper.Map<IEnumerable<StatusResponseDto>>(data));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var entity = await _priorityservice.GetByIdAsync(id);
            if (entity == null) return NotFound();

            return Ok(_mapper.Map<StatusResponseDto>(entity));
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateStatusDto dto)
        {
            var entity = _mapper.Map<Status>(dto);
            await _priorityservice.CreateAsync(entity);

            return Ok(new { message = "Status created" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateStatusDto dto)
        {
            var entity = await _priorityservice.GetByIdAsync(id);
            if (entity == null) return NotFound();

            _mapper.Map(dto, entity);
            await _priorityservice.UpdateAsync(entity);

            return Ok(new { message = "Status updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _priorityservice.DeleteAsync(id);
            return Ok(new { message = "Status deleted" });
        }
    }
}
