using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.DTOs.Users
{
    public class ResetPasswordDto
    {
        public string Email { get; set; }

        public string NewPassword { get; set; }
    }
}
