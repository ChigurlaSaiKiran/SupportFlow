using System.ComponentModel.DataAnnotations;

namespace SupportFlow.Domain.Entities;

public class User
{
    [Key]
    public int Id { get; set; }
    // public string Name { get; set; }
        
    // 🔹 ADD THIS
    public string FullName { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }

    public int RoleId { get; set; }
    public Role Role { get; set; }

    public bool IsActive { get; set; } = true;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public string AvailabilityStatus { get; set; } = "Offline";
    public bool IsOnline { get; set; } = false;
    public DateTime? LastActivityTime { get; set; }

    // Optional but realistic
    public ICollection<Ticket> CreatedTickets { get; set; } = new List<Ticket>();
    public ICollection<Ticket> AssignedTickets { get; set; } = new List<Ticket>();

}
