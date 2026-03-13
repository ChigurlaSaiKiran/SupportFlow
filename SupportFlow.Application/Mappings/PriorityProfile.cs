using AutoMapper;
using SupportFlow.Application.DTOs.Priorities;
using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Mappings
{
    public class PriorityProfile : Profile
    {
        public PriorityProfile()
        {
            CreateMap<CreatePriorityDto, Priority>();
            CreateMap<UpdatePriorityDto, Priority>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<Priority, PriorityResponseDto>();
        }
    }
}
