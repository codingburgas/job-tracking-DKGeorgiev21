using JobSearchAPI.DTOs;
using JobSearchAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobSearchAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly IApplicationService _applicationService;

    public ApplicationsController(IApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    [HttpGet("my-applications")]
    [Authorize(Roles = "USER")]
    public async Task<IActionResult> GetMyApplications()
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var applications = await _applicationService.GetUserApplicationsAsync(int.Parse(userIdClaim));
        return Ok(applications);
    }

    [HttpGet("job/{jobId}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GetJobApplications(int jobId)
    {
        var applications = await _applicationService.GetJobApplicationsAsync(jobId);
        return Ok(applications);
    }

    [HttpGet]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> GetAllApplications()
    {
        var applications = await _applicationService.GetAllApplicationsAsync();
        return Ok(applications);
    }

    [HttpPost("apply/{jobId}")]
    [Authorize(Roles = "USER")]
    public async Task<IActionResult> SubmitApplication(int jobId)
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var application = await _applicationService.SubmitApplicationAsync(int.Parse(userIdClaim), jobId);
        if (application == null)
        {
            return BadRequest(new { message = "You have already applied to this job" });
        }

        return CreatedAtAction(nameof(GetMyApplications), application);
    }

    [HttpPut("{applicationId}/status")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> UpdateApplicationStatus(int applicationId, [FromBody] UpdateApplicationStatusDto dto)
    {
        var application = await _applicationService.UpdateApplicationStatusAsync(applicationId, dto.Status);
        if (application == null)
        {
            return NotFound();
        }
        return Ok(application);
    }
}