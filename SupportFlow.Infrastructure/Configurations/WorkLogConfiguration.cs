using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SupportFlow.Domain.Entities;

namespace SupportFlow.Infrastructure.Configurations;

public class WorkLogConfiguration : IEntityTypeConfiguration<WorkLog>
{
    public void Configure(EntityTypeBuilder<WorkLog> builder)
    {
        // ✅ Fix decimal warning
        builder.Property(w => w.HoursSpent)
            .HasPrecision(5, 2);

        builder.HasOne(w => w.User)
            .WithMany()
            .HasForeignKey(w => w.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(w => w.ApprovedByManager)
            .WithMany()
            .HasForeignKey(w => w.ApprovedByManagerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}