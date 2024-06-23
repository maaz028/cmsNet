using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
  public class PostCategoryModel
  {
    public string? ID { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string? CatID { get; set; }

    [Required]
    public string? CatName { get; set; }
  }
}
