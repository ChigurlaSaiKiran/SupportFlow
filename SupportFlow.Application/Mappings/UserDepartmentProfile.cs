using AutoMapper;
using SupportFlow.Application.DTOs.UserDepartments;
using SupportFlow.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Mappings
{
    public class UserDepartmentProfile : Profile
    {
        public UserDepartmentProfile()
        {
            CreateMap<CreateUserDepartmentDto, UserDepartment>();
            CreateMap<UserDepartment, UserDepartmentResponseDto>();
        }
    }
}
