using System.ComponentModel.DataAnnotations;

namespace JobSearchAPI.Models;

public class Application
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    public int JobPostingId { get; set; }
    
    [Required]
    [StringLength(20)]
    public string Status { get; set; } = "Submitted"; // Submitted, Selected for Interview, Rejected
    
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual JobPosting JobPosting { get; set; } = null!;
}