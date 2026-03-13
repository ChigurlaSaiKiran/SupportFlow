using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SupportFlow.Application.DTOs.UserDepartments;
using SupportFlow.Application.Interfaces;
using SupportFlow.Domain.Entities;

namespace SupportFlow.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/user-departments")]
    public class UserDepartmentController : ControllerBase
    {
        private readonly IUserDepartmentService _service;
        private readonly IMapper _mapper;

        public UserDepartmentController(
            IUserDepartmentService service,
            IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(_mapper.Map<IEnumerable<UserDepartmentResponseDto>>(data));
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateUserDepartmentDto dto)
        {
            var entity = _mapper.Map<UserDepartment>(dto);
            await _service.CreateAsync(entity);

            return Ok(new { message = "User assigned to department successfully" });
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int userId, int departmentId)
        {
            await _service.DeleteAsync(userId, departmentId);
            return Ok(new { message = "User removed from department" });
        }
    }
}
