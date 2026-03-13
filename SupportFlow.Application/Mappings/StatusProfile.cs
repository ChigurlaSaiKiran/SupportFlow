using AutoMapper;
using SupportFlow.Application.DTOs.Statuses;
using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Mappings
{
    public class StatusProfile : Profile
    {
        public StatusProfile()
        {
            CreateMap<CreateStatusDto, Status>();

            CreateMap<UpdateStatusDto, Status>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<Status, StatusResponseDto>();
        }
    }
}
