using JobSearchAPI.DTOs;

namespace JobSearchAPI.Services;

public interface IApplicationService
{
    Task<IEnumerable<ApplicationResponseDto>> GetUserApplicationsAsync(int userId);
    Task<IEnumerable<ApplicationResponseDto>> GetJobApplicationsAsync(int jobId);
    Task<IEnumerable<ApplicationResponseDto>> GetAllApplicationsAsync();
    Task<ApplicationResponseDto?> SubmitApplicationAsync(int userId, int jobId);
    Task<ApplicationResponseDto?> UpdateApplicationStatusAsync(int applicationId, string status);
}