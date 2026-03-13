using Microsoft.EntityFrameworkCore;
using SupportFlow.Domain.Entities;

namespace SupportFlow.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Ticketing Core Tables
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<TicketComment> TicketComments { get; set; }
        public DbSet<TicketAttachment> TicketAttachments { get; set; }

        // ================= MAPPING TABLES =================
        public DbSet<UserDepartment> UserDepartments { get; set; }       
    

        // Master Tables
        public DbSet<Status> Statuses { get; set; }
        public DbSet<Priority> Priorities { get; set; }
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Status>().HasData(
            new Status { Id = 1, Name = "Open" },
            new Status { Id = 2, Name = "In Progress" },
            new Status { Id = 3, Name = "Resolved" },
            new Status { Id = 4, Name = "Closed" }
);

            modelBuilder.Entity<Priority>().HasData(
                new Priority { Id = 1, Name = "Low" },
                new Priority { Id = 2, Name = "Medium" },
                new Priority { Id = 3, Name = "High" },
                new Priority { Id = 4, Name = "Critical" }
            );

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Bug" },
                new Category { Id = 2, Name = "Feature Request" },
                new Category { Id = 3, Name = "Support" }
            );

            // ---------- USER-DEPARTMENT CONFIG ----------
            modelBuilder.Entity<UserDepartment>()
                .HasKey(ud => new { ud.UserId, ud.DepartmentId });

            modelBuilder.Entity<UserDepartment>()
                .HasOne(ud => ud.User)
                .WithMany()
                .HasForeignKey(ud => ud.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserDepartment>()
                .HasOne(ud => ud.Department)
                .WithMany()
                .HasForeignKey(ud => ud.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            //modelBuilder.Entity<Role>().HasData(
            //new Role { Id = 1, Name = "Admin" },
            //new Role { Id = 2, Name = "Agent" },
            //new Role { Id = 3, Name = "User" }
            //);


            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }
    }
}
