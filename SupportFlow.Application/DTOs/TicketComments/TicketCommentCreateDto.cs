namespace SupportFlow.Application.DTOs.TicketComments
{
    public class TicketCommentCreateDto
    {
        public int TicketId { get; set; }
        public string Comment { get; set; }
        public int CommentedById { get; set; }
    }
}
