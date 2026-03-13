using System.ComponentModel.DataAnnotations;

namespace SupportFlow.Domain.Entities;

public class Role
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } // Admin, Agent, User
}
