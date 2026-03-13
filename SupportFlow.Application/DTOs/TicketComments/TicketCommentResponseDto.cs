namespace SupportFlow.Application.DTOs.TicketComments
{
    public class TicketCommentResponseDto
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public string Comment { get; set; }
        public int CommentedById { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
