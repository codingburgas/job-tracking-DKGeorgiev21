using JobSearchAPI.DTOs;

namespace JobSearchAPI.Services;

public interface IJobService
{
    Task<IEnumerable<JobPostingResponseDto>> GetAllJobsAsync(int? userId = null);
    Task<JobPostingResponseDto?> GetJobByIdAsync(int id, int? userId = null);
    Task<JobPostingResponseDto> CreateJobAsync(CreateJobPostingDto dto, int createdByUserId);
    Task<JobPostingResponseDto?> UpdateJobAsync(int id, UpdateJobPostingDto dto);
    Task<bool> DeleteJobAsync(int id);
}