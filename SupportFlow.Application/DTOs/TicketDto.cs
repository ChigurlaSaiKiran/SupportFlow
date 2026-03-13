namespace SupportFlow.Application.DTOs
{
    public class TicketDto
    {

        public int Id { get; set; }   // 0 = Create, >0 = Update/View

        public string Title { get; set; }
        public string Description { get; set; }

        public int StatusId { get; set; }
        public int PriorityId { get; set; }
        public int CategoryId { get; set; }

        public int DepartmentId { get; set; }

        public int CreatedById { get; set; }
        public int? AssignedToId { get; set; }
        //public int Id { get; set; }          // 0 for Create, >0 for Update/View
        //public string Title { get; set; }
        //public string Description { get; set; }
        //public string Priority { get; set; } // Low / Medium / High
        //public string Status { get; set; }   // Open / InProgress / Closed
    }
}
