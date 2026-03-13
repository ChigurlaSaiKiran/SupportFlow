using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.DTOs.UserDepartments
{
    public class CreateUserDepartmentDto
    {
        public int UserId { get; set; }
        public int DepartmentId { get; set; }
    }

}
