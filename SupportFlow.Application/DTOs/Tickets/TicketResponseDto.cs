using SupportFlow.Application.DTOs.Category;
using SupportFlow.Application.DTOs.Departments;
using SupportFlow.Application.DTOs.Priorities;
using SupportFlow.Application.DTOs.Statuses;
using SupportFlow.Application.DTOs.Users;

namespace SupportFlow.Application.DTOs.Tickets
{
    public class TicketResponseDto
    {
        public int Id { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public StatusResponseDto Status { get; set; }
        //public string Priority { get; set; }
        //public string Category { get; set; }
        public PriorityResponseDto Priority { get; set; }
        public ResponseCategoryDto Category { get; set; }
        public DepartmentResponseDto Department { get; set; }
       // public string Department { get; set; }

        public UserResponseDto CreatedBy { get; set; }
        public UserResponseDto AssignedTo { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
