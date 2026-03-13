namespace SupportFlow.Application.DTOs.TicketAttachments
{
    public class TicketAttachmentCreateDto
    {
        public int TicketId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string ContentType { get; set; }
    }
}
