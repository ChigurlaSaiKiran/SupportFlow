using AutoMapper;
using SupportFlow.Application.DTOs.WorkLogs;
using SupportFlow.Domain.Entities;

namespace SupportFlow.Application.Mappings;

public class WorkLogProfile : Profile
{
    public WorkLogProfile()
    {
        CreateMap<WorkLog, WorkLogResponseDto>()
            .ForMember(d => d.UserFullName,
                o => o.MapFrom(s => s.User != null ? s.User.FullName : ""))
            .ForMember(d => d.ApprovedByManagerName,
                o => o.MapFrom(s => s.ApprovedByManager != null
                    ? s.ApprovedByManager.FullName : null));

        CreateMap<CreateWorkLogDto, WorkLog>();
        CreateMap<UpdateWorkLogDto, WorkLog>();
    }
}