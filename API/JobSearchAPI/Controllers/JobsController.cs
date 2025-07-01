using JobSearchAPI.DTOs;
using JobSearchAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JobSearchAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobsController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobsController(IJobService jobService)
    {
        _jobService = jobService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllJobs()
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        int? userId = userIdClaim != null ? int.Parse(userIdClaim) : null;
        
        var jobs = await _jobService.GetAllJobsAsync(userId);
        return Ok(jobs);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetJobById(int id)
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        int? userId = userIdClaim != null ? int.Parse(userIdClaim) : null;
        
        var job = await _jobService.GetJobByIdAsync(id, userId);
        if (job == null)
        {
            return NotFound();
        }
        return Ok(job);
    }

    [HttpPost]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> CreateJob([FromBody] CreateJobPostingDto dto)
    {
        var userIdClaim = User.FindFirst("id")?.Value;
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var job = await _jobService.CreateJobAsync(dto, int.Parse(userIdClaim));
        return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, job);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> UpdateJob(int id, [FromBody] UpdateJobPostingDto dto)
    {
        var job = await _jobService.UpdateJobAsync(id, dto);
        if (job == null)
        {
            return NotFound();
        }
        return Ok(job);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "ADMIN")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        var success = await _jobService.DeleteJobAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
}