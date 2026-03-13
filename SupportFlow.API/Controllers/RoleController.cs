using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupportFlow.Application.DTOs.Roles;
using SupportFlow.Application.Interfaces;
using SupportFlow.Infrastructure.Data;

namespace SupportFlow.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        // GET: api/role
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var roles = await _roleService.GetAllAsync();

            return Ok(roles);
        }

        // GET: api/role/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var role = await _roleService.GetByIdAsync(id);

            if (role == null)
                return NotFound(new
                {
                    message = "Role not found"
                });

            return Ok(role);
        }

        // POST: api/role
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRoleDto dto)
        {
            var id = await _roleService.CreateAsync(dto);

            return Ok(new
            {
                message = "Role created successfully",
                id = id
            });
        }

        // PUT: api/role/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateRoleDto dto)
        {
            var updated = await _roleService.UpdateAsync(id, dto);

            if (!updated)
                return NotFound(new
                {
                    message = "Role not found"
                });

            return Ok(new
            {
                message = "Role updated successfully"
            });
        }

        // DELETE: api/role/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _roleService.DeleteAsync(id);

            if (!deleted)
                return NotFound(new
                {
                    message = "Role not found"
                });

            return Ok(new
            {
                message = "Role deleted successfully"
            });
        }
    }

}
