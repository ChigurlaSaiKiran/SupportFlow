using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SupportFlow.Domain.Entities;

public class WorkLog
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    [Required]
    [MaxLength(1000)]
    public string TaskDescription { get; set; }

    public decimal HoursSpent { get; set; }

    public string TaskStatus { get; set; } = "InProgress";

    public string ApprovalStatus { get; set; } = "Pending";

    public string? ManagerComment { get; set; }

    public int? ApprovedByManagerId { get; set; }

    [ForeignKey("ApprovedByManagerId")]
    public User? ApprovedByManager { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}