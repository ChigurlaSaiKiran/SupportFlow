namespace SupportFlow.Application.DTOs.Tickets
{
    public class UpdateTicketDto
    {
        public int Id { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        //required StatusId in update
        public int StatusId { get; set; }

        public int PriorityId { get; set; }
        public int CategoryId { get; set; }
        public int DepartmentId { get; set; }

     //   public int? CreatedById { get; set; } //we shd not edit who created ticket
        public int? AssignedToId { get; set; }// Only this editable
    }
}
