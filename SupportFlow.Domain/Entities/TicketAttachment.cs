using SupportFlow.Domain.Entities;
using System.ComponentModel.DataAnnotations;

public class TicketAttachment
{
    [Key]
    public int Id { get; set; }

    public int TicketId { get; set; }
    public Ticket Ticket { get; set; }
   
    public string FileName { get; set; }   // original name  
    public string FilePath { get; set; }   // server path
    public string ContentType { get; set; } // image/png, application/pdf

    public DateTime UploadedDate { get; set; } = DateTime.UtcNow;
}






//using System.ComponentModel.DataAnnotations;

//namespace SupportFlow.Domain.Entities;

//public class TicketAttachment
//{
//    [Key]
//    public int Id { get; set; }

//    public int TicketId { get; set; }
//    public Ticket Ticket { get; set; }

//    public string FilePath { get; set; }
//    public DateTime UploadedDate { get; set; } = DateTime.UtcNow;
//}
