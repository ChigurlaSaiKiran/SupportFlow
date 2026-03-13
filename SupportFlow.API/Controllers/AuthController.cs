using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SupportFlow.API.Auth;
using SupportFlow.Application.DTOs.Auth;
using SupportFlow.Application.DTOs.Users;
using SupportFlow.Application.Interfaces;

namespace SupportFlow.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public AuthController(
            IUserService userService,
            ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userService.LoginAsync(dto.Email, dto.Password);

            if (user == null)
                return Unauthorized("Invalid email or password");

            var token = _tokenService.GenerateToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    user.RoleId,
                    roleName = user.Role.Name
                }
            });
        }
        //[HttpPost("login")]
        //public async Task<IActionResult> Login(LoginDto dto)
        //{
        //    var user = await _userService.LoginAsync(dto.Email, dto.Password);

        //    if (user == null)
        //        return Unauthorized("Invalid email or password");

        //    var token = _tokenService.GenerateToken(user);

        //    return Ok(new { token });
        //}
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword( ForgotPasswordDto dto)
        {
            var user =
                await _userService.GetByEmailAsync(dto.Email);

            if (user == null)
                return Ok(new { message = "If this email is registered, you will receive a reset link." });

            return Ok(new
            {
                message =
                "User found. You can reset password"
            });
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var user = await _userService.GetByEmailAsync(dto.Email);

            if (user == null)
                return NotFound();

            user.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            await _userService.UpdatePasswordAsync(user);

            return Ok("Password reset successful");
        }
    }

}
