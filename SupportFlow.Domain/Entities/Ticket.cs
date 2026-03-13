using System.ComponentModel.DataAnnotations;

namespace SupportFlow.Domain.Entities;

public class Ticket
{
    [Key]
    public int Id { get; set; }
    [Required]
    [MaxLength(200)]
    public string Title { get; set; }
    [Required]
    [MaxLength(2000)]
    public string Description { get; set; }

    // SAFE DEFAULT
    public int StatusId { get; set; } = 1; // nullable if optional
    public Status Status { get; set; }
    public int PriorityId { get; set; }
    public Priority Priority { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; }

    public int CreatedById { get; set; }
    public User CreatedBy { get; set; }
    public int? AssignedToId { get; set; }
    public User AssignedTo { get; set; }

    public int DepartmentId { get; set; }
    public Department Department { get; set; }
  
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
