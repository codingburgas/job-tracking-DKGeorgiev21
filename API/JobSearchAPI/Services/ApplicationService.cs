using JobSearchAPI.Data;
using JobSearchAPI.DTOs;
using JobSearchAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace JobSearchAPI.Services;

public class ApplicationService : IApplicationService
{
    private readonly ApplicationDbContext _context;

    public ApplicationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ApplicationResponseDto>> GetUserApplicationsAsync(int userId)
    {
        var applications = await _context.Applications
            .Include(a => a.JobPosting)
            .Include(a => a.User)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.SubmittedAt)
            .ToListAsync();

        return applications.Select(a => new ApplicationResponseDto
        {
            Id = a.Id,
            Status = a.Status,
            SubmittedAt = a.SubmittedAt,
            UpdatedAt = a.UpdatedAt,
            JobTitle = a.JobPosting.Title,
            CompanyName = a.JobPosting.CompanyName,
            ApplicantName = $"{a.User.FirstName} {a.User.LastName}",
            JobPostingId = a.JobPostingId,
            UserId = a.UserId
        });
    }

    public async Task<IEnumerable<ApplicationResponseDto>> GetJobApplicationsAsync(int jobId)
    {
        var applications = await _context.Applications
            .Include(a => a.JobPosting)
            .Include(a => a.User)
            .Where(a => a.JobPostingId == jobId)
            .OrderByDescending(a => a.SubmittedAt)
            .ToListAsync();

        return applications.Select(a => new ApplicationResponseDto
        {
            Id = a.Id,
            Status = a.Status,
            SubmittedAt = a.SubmittedAt,
            UpdatedAt = a.UpdatedAt,
            JobTitle = a.JobPosting.Title,
            CompanyName = a.JobPosting.CompanyName,
            ApplicantName = $"{a.User.FirstName} {a.User.LastName}",
            JobPostingId = a.JobPostingId,
            UserId = a.UserId
        });
    }

    public async Task<IEnumerable<ApplicationResponseDto>> GetAllApplicationsAsync()
    {
        var applications = await _context.Applications
            .Include(a => a.JobPosting)
            .Include(a => a.User)
            .OrderByDescending(a => a.SubmittedAt)
            .ToListAsync();

        return applications.Select(a => new ApplicationResponseDto
        {
            Id = a.Id,
            Status = a.Status,
            SubmittedAt = a.SubmittedAt,
            UpdatedAt = a.UpdatedAt,
            JobTitle = a.JobPosting.Title,
            CompanyName = a.JobPosting.CompanyName,
            ApplicantName = $"{a.User.FirstName} {a.User.LastName}",
            JobPostingId = a.JobPostingId,
            UserId = a.UserId
        });
    }

    public async Task<ApplicationResponseDto?> SubmitApplicationAsync(int userId, int jobId)
    {
        // Check if user already applied to this job
        var existingApplication = await _context.Applications
            .FirstOrDefaultAsync(a => a.UserId == userId && a.JobPostingId == jobId);

        if (existingApplication != null)
        {
            return null; // User already applied
        }

        var application = new Models.Application
        {
            UserId = userId,
            JobPostingId = jobId,
            Status = "Submitted"
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        // Load related data
        await _context.Entry(application)
            .Reference(a => a.JobPosting)
            .LoadAsync();
        await _context.Entry(application)
            .Reference(a => a.User)
            .LoadAsync();

        return new ApplicationResponseDto
        {
            Id = application.Id,
            Status = application.Status,
            SubmittedAt = application.SubmittedAt,
            UpdatedAt = application.UpdatedAt,
            JobTitle = application.JobPosting.Title,
            CompanyName = application.JobPosting.CompanyName,
            ApplicantName = $"{application.User.FirstName} {application.User.LastName}",
            JobPostingId = application.JobPostingId,
            UserId = application.UserId
        };
    }

    public async Task<ApplicationResponseDto?> UpdateApplicationStatusAsync(int applicationId, string status)
    {
        var application = await _context.Applications
            .Include(a => a.JobPosting)
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == applicationId);

        if (application == null) return null;

        application.Status = status;
        application.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ApplicationResponseDto
        {
            Id = application.Id,
            Status = application.Status,
            SubmittedAt = application.SubmittedAt,
            UpdatedAt = application.UpdatedAt,
            JobTitle = application.JobPosting.Title,
            CompanyName = application.JobPosting.CompanyName,
            ApplicantName = $"{application.User.FirstName} {application.User.LastName}",
            JobPostingId = application.JobPostingId,
            UserId = application.UserId
        };
    }
}