using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SupportFlow.Domain.Entities;

public class Attendance
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow.Date;

    public DateTime? CheckInTime { get; set; }

    public DateTime? CheckOutTime { get; set; }

    // Present / Absent / Late / Leave
    public string Status { get; set; } = "Present";

    // Auto calculated when checkout
    public decimal? TotalHours { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}