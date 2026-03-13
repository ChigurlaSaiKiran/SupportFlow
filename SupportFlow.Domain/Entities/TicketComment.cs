using System.ComponentModel.DataAnnotations;

namespace SupportFlow.Domain.Entities;

public class TicketComment
{
    [Key]
    public int Id { get; set; }

    public int TicketId { get; set; }
    public Ticket Ticket { get; set; }
    [Required]
    public string Comment { get; set; }

    public int CommentedById { get; set; }
    public User CommentedBy { get; set; }

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
