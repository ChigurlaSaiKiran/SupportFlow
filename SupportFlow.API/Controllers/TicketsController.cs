using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using SupportFlow.Application.DTOs;
using SupportFlow.Application.DTOs.Tickets;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace SupportFlow.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketService _ticketService;
        private readonly IMapper _mapper;

        public TicketsController(
            ITicketService ticketService,
            IMapper mapper)
        {
            _ticketService = ticketService;
            _mapper = mapper;
        }

        // ---------------- GET ALL ----------------
        [HttpGet]
        // public async Task<IActionResult> GetAll()     
        public async Task<ActionResult<IEnumerable<TicketResponseDto>>> GetAll()

        {
            var tickets = await _ticketService.GetAllAsync();
            var result = _mapper.Map<IEnumerable<TicketResponseDto>>(tickets);
            return Ok(result);
        }

        // ---------------- GET BY ID ----------------
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ticket = await _ticketService.GetByIdAsync(id);
            if (ticket == null)
                return NotFound(new { message = "Ticket not found" }); // 404

            var result = _mapper.Map<TicketResponseDto>(ticket);
            return Ok(result);
        }


        // ---------------- CREATE ----------------
        [HttpPost]
        // public async Task<IActionResult> Create(TicketDto dto)       
        public async Task<IActionResult> Create(CreateTicketDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
         //   var userId = int.Parse(User.FindFirst("id").Value);
            var ticket = _mapper.Map<Ticket>(dto);
       //     ticket.CreatedById = userId;
            await _ticketService.CreateAsync(ticket);
           // return Ok(new { message = "Ticket created successfully" });
            return CreatedAtAction(nameof(GetById), new { id = ticket.Id }, ticket);

        }


        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTicketDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                if (id != dto.Id)
                    return BadRequest("Route ID and Body ID mismatch");

                await _ticketService.UpdateAsync(id, dto);
                return Ok(new { message = "Ticket updated successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }

            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, new { message = "An error occurred while updating the ticket" });
            }
        }       

        // ---------------- DELETE ----------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _ticketService.DeleteAsync(id);
            return Ok(new { message = "Ticket deleted successfully" });
        }
       
    }
}
