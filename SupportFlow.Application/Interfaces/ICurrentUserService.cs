using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SupportFlow.Application.Interfaces
{
    public interface ICurrentUserService
    {
        int UserId { get; }
    }
}
