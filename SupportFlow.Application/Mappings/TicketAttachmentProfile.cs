using AutoMapper;
using SupportFlow.Application.DTOs.TicketAttachments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Mappings
{
    public class TicketAttachmentProfile : Profile
    {
        public TicketAttachmentProfile()
        {
            CreateMap<TicketAttachmentCreateDto, TicketAttachment>();

            CreateMap<TicketAttachmentUpdateDto, TicketAttachment>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<TicketAttachment, TicketAttachmentResponseDto>();
        }
    }
}
