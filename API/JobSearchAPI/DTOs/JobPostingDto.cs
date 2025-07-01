using System.ComponentModel.DataAnnotations;

namespace JobSearchAPI.DTOs;

public class CreateJobPostingDto
{
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string CompanyName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;
}

public class UpdateJobPostingDto : CreateJobPostingDto
{
    public bool IsActive { get; set; }
}

public class JobPostingResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DatePosted { get; set; }
    public bool IsActive { get; set; }
    public string CreatedByName { get; set; } = string.Empty;
    public int ApplicationCount { get; set; }
    public bool HasApplied { get; set; }
}