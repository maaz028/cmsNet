using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
  public class PostBodyModel
  {

    public string? Id { get; set; }

    [Required(AllowEmptyStrings = false)]
    public string? Title { get; set; }

    [Required]
    public string? Permalink { get; set; }

    [Required]
    public PostCategoryModel? Category { get; set; }


    public string? PostImgPath { get; set; }

    [Required]
    public string? Excerpt { get; set; }

    [Required]
    public string? Content { get; set; }

    public Boolean? IsFeatured { get; set; }

    public int? Views { get; set; }

    public string? Status { get; set; }

  }
}
