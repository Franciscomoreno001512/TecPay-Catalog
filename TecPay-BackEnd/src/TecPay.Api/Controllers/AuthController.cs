using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using TecPay.Application.DTOs;

namespace TecPay.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IConfiguration config) : ControllerBase
{
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), 200)]
    [ProducesResponseType(typeof(ApiResponse<object>), 401)]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (request.Username != "admin" || request.Password != "TecPay2025!")
            return Unauthorized(ApiResponse<object>.Fail("Invalid credentials."));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiration = DateTime.UtcNow.AddHours(2);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, request.Username),
            new Claim(ClaimTypes.Role, "Admin"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: expiration,
            signingCredentials: credentials);

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return Ok(ApiResponse<LoginResponse>.Ok(new LoginResponse(tokenString, expiration)));
    }
}
