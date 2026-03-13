using AutoMapper;
using SupportFlow.Application.DTOs.TicketComments;
using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Mappings
{
    public class TicketCommentProfile : Profile
    {
        public TicketCommentProfile()
        {
            CreateMap<TicketCommentCreateDto, TicketComment>();

            CreateMap<TicketCommentUpdateDto, TicketComment>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.TicketId, opt => opt.Ignore())
                .ForMember(dest => dest.CommentedById, opt => opt.Ignore());

            CreateMap<TicketComment, TicketCommentResponseDto>();
        }
    }
}
