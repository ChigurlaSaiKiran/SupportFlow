namespace SupportFlow.Application.DTOs.TicketAttachments
{
    public class TicketAttachmentUpdateDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string ContentType { get; set; }
    }
}
