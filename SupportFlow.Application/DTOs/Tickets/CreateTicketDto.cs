namespace SupportFlow.Application.DTOs.Tickets
{
    public class CreateTicketDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
       // public int? StatusId { get; set; }   // match entity
        public int PriorityId { get; set; }
        public int CategoryId { get; set; }
        public int DepartmentId { get; set; }
       // public int CreatedById { get; set; } // bcuz it shd automatic come user who created
        public int AssignedToId { get; set; }
        // public int CreatedById { get; set; }
    }
}
