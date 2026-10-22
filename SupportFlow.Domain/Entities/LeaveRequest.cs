using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SupportFlow.Domain.Entities;

public class LeaveRequest
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }

    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    // Casual / Sick / Earned
    public string LeaveType { get; set; }

    [MaxLength(500)]
    public string Reason { get; set; }

    // Pending / Approved / Rejected
    public string Status { get; set; } = "Pending";

    public int? ApprovedByManagerId { get; set; }

    [ForeignKey("ApprovedByManagerId")]
    public User? ApprovedByManager { get; set; }

    public string? ManagerComment { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}