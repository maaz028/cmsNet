using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Core.Models
{
  public class CategoryModel
  {
    [Key]
    [AllowNull]
    public string? ID { get; set; }

    [Required]
    [MaxLength(20, ErrorMessage = "Name cannot exceeds 20 characters")]
    public string? Name { get; set; }

    public DateTime? CreatedDate { get; set; } = DateTime.Now;

    public DateTime? UpdatedDate { get; set; }
  }
}
