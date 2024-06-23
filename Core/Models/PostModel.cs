using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
  public class PostModel
  {
    [Key]
    public string? ID { get; set; }

    [Required]
    public string? Title { get; set; }

    [Required]
    public string? Permalink { get; set; }

    [Required]
    public PostCategoryModel? Category { get; set; }

    [Required]
    public string? PostImgPath { get; set; }

    [Required]
    public string? Excerpt { get; set; }

    [Required]
    public string? Content { get; set; }

    public Boolean IsFeatured { get; set; } = false;

    public int Views { get; set; } = 0;

    public string Status { get; set; } = "new";

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; }
  }
}
