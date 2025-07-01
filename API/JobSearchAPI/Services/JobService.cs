using JobSearchAPI.Data;
using JobSearchAPI.DTOs;
using JobSearchAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace JobSearchAPI.Services;

public class JobService : IJobService
{
    private readonly ApplicationDbContext _context;

    public JobService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<JobPostingResponseDto>> GetAllJobsAsync(int? userId = null)
    {
        var query = _context.JobPostings
            .Include(j => j.CreatedBy)
            .Include(j => j.Applications)
            .ThenInclude(a => a.User)
            .Where(j => j.IsActive);

        var jobs = await query.ToListAsync();

        return jobs.Select(j => new JobPostingResponseDto
        {
            Id = j.Id,
            Title = j.Title,
            CompanyName = j.CompanyName,
            Description = j.Description,
            DatePosted = j.DatePosted,
            IsActive = j.IsActive,
            CreatedByName = $"{j.CreatedBy.FirstName} {j.CreatedBy.LastName}",
            ApplicationCount = j.Applications.Count,
            HasApplied = userId.HasValue && j.Applications.Any(a => a.UserId == userId.Value)
        });
    }

    public async Task<JobPostingResponseDto?> GetJobByIdAsync(int id, int? userId = null)
    {
        var job = await _context.JobPostings
            .Include(j => j.CreatedBy)
            .Include(j => j.Applications)
            .FirstOrDefaultAsync(j => j.Id == id);

        if (job == null) return null;

        return new JobPostingResponseDto
        {
            Id = job.Id,
            Title = job.Title,
            CompanyName = job.CompanyName,
            Description = job.Description,
            DatePosted = job.DatePosted,
            IsActive = job.IsActive,
            CreatedByName = $"{job.CreatedBy.FirstName} {job.CreatedBy.LastName}",
            ApplicationCount = job.Applications.Count,
            HasApplied = userId.HasValue && job.Applications.Any(a => a.UserId == userId.Value)
        };
    }

    public async Task<JobPostingResponseDto> CreateJobAsync(CreateJobPostingDto dto, int createdByUserId)
    {
        var job = new JobPosting
        {
            Title = dto.Title,
            CompanyName = dto.CompanyName,
            Description = dto.Description,
            CreatedByUserId = createdByUserId
        };

        _context.JobPostings.Add(job);
        await _context.SaveChangesAsync();

        var createdBy = await _context.Users.FindAsync(createdByUserId);

        return new JobPostingResponseDto
        {
            Id = job.Id,
            Title = job.Title,
            CompanyName = job.CompanyName,
            Description = job.Description,
            DatePosted = job.DatePosted,
            IsActive = job.IsActive,
            CreatedByName = $"{createdBy!.FirstName} {createdBy.LastName}",
            ApplicationCount = 0,
            HasApplied = false
        };
    }

    public async Task<JobPostingResponseDto?> UpdateJobAsync(int id, UpdateJobPostingDto dto)
    {
        var job = await _context.JobPostings
            .Include(j => j.CreatedBy)
            .Include(j => j.Applications)
            .FirstOrDefaultAsync(j => j.Id == id);

        if (job == null) return null;

        job.Title = dto.Title;
        job.CompanyName = dto.CompanyName;
        job.Description = dto.Description;
        job.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        return new JobPostingResponseDto
        {
            Id = job.Id,
            Title = job.Title,
            CompanyName = job.CompanyName,
            Description = job.Description,
            DatePosted = job.DatePosted,
            IsActive = job.IsActive,
            CreatedByName = $"{job.CreatedBy.FirstName} {job.CreatedBy.LastName}",
            ApplicationCount = job.Applications.Count,
            HasApplied = false
        };
    }

    public async Task<bool> DeleteJobAsync(int id)
    {
        var job = await _context.JobPostings.FindAsync(id);
        if (job == null) return false;

        _context.JobPostings.Remove(job);
        await _context.SaveChangesAsync();
        return true;
    }
}