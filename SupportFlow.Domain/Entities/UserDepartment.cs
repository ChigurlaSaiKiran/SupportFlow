using System.ComponentModel.DataAnnotations;

namespace SupportFlow.Domain.Entities;

public class UserDepartment
{
    [Key]
    public int UserId { get; set; }
    public User User { get; set; }

    public int DepartmentId { get; set; }
    public Department Department { get; set; }
}
