using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.DTOs.TicketAttachments
{
    public class TicketAttachmentUploadDto
    {
        public int TicketId { get; set; }
        public IFormFile File { get; set; }
    }

}
