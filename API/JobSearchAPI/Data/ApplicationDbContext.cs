using JobSearchAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace JobSearchAPI.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<JobPosting> JobPostings { get; set; }
    public DbSet<Application> Applications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User entity configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.Role).HasDefaultValue("USER");
        });

        // JobPosting entity configuration
        modelBuilder.Entity<JobPosting>(entity =>
        {
            entity.HasOne(d => d.CreatedBy)
                  .WithMany()
                  .HasForeignKey(d => d.CreatedByUserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Application entity configuration
        modelBuilder.Entity<Application>(entity =>
        {
            entity.HasOne(d => d.User)
                  .WithMany(p => p.Applications)
                  .HasForeignKey(d => d.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.JobPosting)
                  .WithMany(p => p.Applications)
                  .HasForeignKey(d => d.JobPostingId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Ensure a user can only apply once to a specific job
            entity.HasIndex(e => new { e.UserId, e.JobPostingId }).IsUnique();
        });
    }
}