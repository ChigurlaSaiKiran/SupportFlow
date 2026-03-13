using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SupportFlow.Application.DTOs.TicketComments;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;

namespace SupportFlow.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/ticket-comments")]
    public class TicketCommentController : ControllerBase
    {
        private readonly ITicketCommentService _service;
        private readonly IMapper _mapper;

        public TicketCommentController(
            ITicketCommentService service,
            IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        // GET: api/ticket-comments
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entities = await _service.GetAllAsync();
            var result = _mapper.Map<IEnumerable<TicketCommentResponseDto>>(entities);
            return Ok(result);// 200 OK
        }

        // GET: api/ticket-comments/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null)
                return NotFound(new { message = "Ticket comment not found" }); // 404

            var result = _mapper.Map<TicketCommentResponseDto>(entity);
            return Ok(result); // 200 OK
            // return Ok(_mapper.Map<TicketCommentResponseDto>(entity));
        }

        // POST: api/ticket-comments
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TicketCommentCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState); // 400 for validation errors

            var entity = _mapper.Map<TicketComment>(dto);
            await _service.CreateAsync(entity);

            // Return 201 Created with the new resource
            return CreatedAtAction(nameof(GetById), new { id = entity.Id },
                new { message = "Ticket comment added successfully", id = entity.Id });
        }

        //[HttpPost]
        //public async Task<IActionResult> Create(TicketCommentCreateDto dto)
        //{
        //    var entity = _mapper.Map<TicketComment>(dto);
        //    await _service.CreateAsync(entity);

        //    return Ok(new { message = "Ticket comment added successfully" });
        //}

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TicketCommentUpdateDto dto)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null)
                return NotFound(new { message = "Ticket comment not found" }); // 404

            _mapper.Map(dto, entity);
            await _service.UpdateAsync(entity);

            return Ok(new { message = "Ticket comment updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null)
                return NotFound(new { message = "Ticket comment not found" }); // 404

            await _service.DeleteAsync(id);
            return Ok(new { message = "Ticket comment deleted successfully" });
        }
    }
}
