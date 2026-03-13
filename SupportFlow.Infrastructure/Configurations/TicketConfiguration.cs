using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SupportFlow.Domain.Entities;

namespace SupportFlow.Infrastructure.Data.Configurations;

public class TicketConfiguration : IEntityTypeConfiguration<Ticket>
{
    public void Configure(EntityTypeBuilder<Ticket> builder)
    {
        builder.ToTable("Tickets");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Title)
               .IsRequired()
               .HasMaxLength(200);

        builder.Property(t => t.Description)
               .HasMaxLength(2000);

        builder.Property(t => t.CreatedDate)
               .IsRequired();

        // Department
        builder.HasOne(t => t.Department)
               .WithMany(d => d.Tickets)
               .HasForeignKey(t => t.DepartmentId)
               .OnDelete(DeleteBehavior.Restrict);

        // Created By
        builder.HasOne(t => t.CreatedBy)
               .WithMany(u => u.CreatedTickets)
               .HasForeignKey(t => t.CreatedById)
               //.IsRequired()
               .OnDelete(DeleteBehavior.Restrict)
              .IsRequired(false);

        // Assigned To (Nullable)
        builder.HasOne(t => t.AssignedTo)
             //.WithMany()
               .WithMany(u => u.AssignedTickets)
               .HasForeignKey(t => t.AssignedToId)
               .IsRequired(false);
               //.OnDelete(DeleteBehavior.SetNull);
    }
}
