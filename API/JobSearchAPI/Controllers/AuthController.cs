using JobSearchAPI.DTOs;
using JobSearchAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace JobSearchAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var (success, token, user) = await _authService.LoginAsync(loginDto);

        if (!success)
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        return Ok(new
        {
            token,
            user = new
            {
                id = user!.Id,
                username = user.Username,
                firstName = user.FirstName,
                middleName = user.MiddleName,
                lastName = user.LastName,
                role = user.Role
            }
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var (success, message, user) = await _authService.RegisterAsync(registerDto);

        if (!success)
        {
            return BadRequest(new { message });
        }

        var token = _authService.GenerateJwtToken(user!);

        return Ok(new
        {
            message,
            token,
            user = new
            {
                id = user.Id,
                username = user.Username,
                firstName = user.FirstName,
                middleName = user.MiddleName,
                lastName = user.LastName,
                role = user.Role
            }
        });
    }
}