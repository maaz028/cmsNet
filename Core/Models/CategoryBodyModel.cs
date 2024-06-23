using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
  public class CategoryBodyModel
  {
    public string? ID { get; set; }

    [Required]
    [MaxLength(20, ErrorMessage = "Name cannot exceeds 20 characters")]
    public string? Name { get; set; }

  }
}
