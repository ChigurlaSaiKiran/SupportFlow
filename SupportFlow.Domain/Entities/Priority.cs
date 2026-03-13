using System.ComponentModel.DataAnnotations;

namespace SupportFlow.Domain.Entities;

public class Priority
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; }
}
