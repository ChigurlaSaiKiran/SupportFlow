using AutoMapper;
using SupportFlow.Application.DTOs;
using SupportFlow.Application.DTOs.Tickets;
using SupportFlow.Domain.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

public class TicketProfile : Profile
{
    public TicketProfile()
    {
        CreateMap<CreateTicketDto, Ticket>();

        CreateMap<UpdateTicketDto, Ticket>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.DepartmentId, opt => opt.Ignore())

            // ✅ IMPORTANT FIX
            .ForMember(dest => dest.AssignedToId, opt =>
                opt.Condition(src => src.AssignedToId.HasValue));

        CreateMap<Ticket, TicketResponseDto>();
    }
}





//using AutoMapper;
//using SupportFlow.Application.DTOs;
//using SupportFlow.Application.DTOs.Tickets;
//using SupportFlow.Domain.Entities;
//using static System.Runtime.InteropServices.JavaScript.JSType;

//namespace SupportFlow.Application.Mappings
//{
//    public class TicketProfile : Profile
//    {
//        public TicketProfile()
//        {
//            // CreateMap<Ticket, TicketDto>().ReverseMap();
//            CreateMap<CreateTicketDto, Ticket>();

//            CreateMap<UpdateTicketDto, Ticket>()
//                .ForMember(dest => dest.Id, opt => opt.Ignore())
//              .ForMember(dest => dest.DepartmentId, opt => opt.Ignore())
//            // Ensure AssignedToId only updates if the DTO has a value
//           .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

//            CreateMap<Ticket, TicketResponseDto>();
//                //.ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.Name))
//             //   .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => src.Priority.Name))
//              //  .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Name))
//              //  .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src.Department.Name));

//        }
//    }
//}


