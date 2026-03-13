using System.ComponentModel.DataAnnotations;

namespace SupportFlow.Domain.Entities;

public class Department
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }

    // 🔹 ADD THIS
    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
