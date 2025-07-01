using System.ComponentModel.DataAnnotations;

namespace JobSearchAPI.Models;

public class JobPosting
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string CompanyName { get; set; } = string.Empty;
    
    [Required]
    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    public DateTime DatePosted { get; set; } = DateTime.UtcNow;
    
    public bool IsActive { get; set; } = true;
    
    public int CreatedByUserId { get; set; }
    
    // Navigation properties
    public virtual User CreatedBy { get; set; } = null!;
    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
}