using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SupportFlow.Application.DTOs.Users;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;

namespace SupportFlow.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UsersController(
            IUserService userService,
            IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        // ---------------- GET ALL ----------------

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAll()
        {
            var users = await _userService.GetAllAsync();

            var result =
                _mapper.Map<IEnumerable<UserResponseDto>>(users);

            return Ok(result);
        }

        // ---------------- GET BY ID ----------------

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);

            if (user == null)
                return NotFound(new { message = "User not found" });

            var result =
                _mapper.Map<UserResponseDto>(user);

            return Ok(result);
        }

        // ---------------- CREATE ----------------

        [HttpPost]
        public async Task<IActionResult> Create(UserCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user =
                await _userService.CreateUserAsync(dto);

            // ✅ Map to DTO — never return raw entity
            var result = _mapper.Map<UserResponseDto>(user);

            return CreatedAtAction(
                nameof(GetById),
                new { id = user.Id },
                user);
        }

        // ---------------- UPDATE ----------------

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            UserUpdateDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                await _userService.UpdateAsync(id, dto);

                return Ok(new
                {
                    message =
                    "User updated successfully"
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500,
                    new
                    {
                        message =
                        "Error updating user"
                    });
            }
        }

        // ---------------- DELETE ----------------

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _userService.DeleteAsync(id);

            return Ok(new
            {
                message =
                "User deleted successfully"
            });
        }
    }
}