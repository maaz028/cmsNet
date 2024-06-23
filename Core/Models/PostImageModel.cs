using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace Core.Models
{
  public class PostImageModel
  {
    [Key]
    public  string? ID { get; set; }

    [Required]
    [NotMapped]
    public IFormFile? Photo { get; set; }

    [Required]
    public string? Name { get; set; }

    [Required]
    public string? Size { get; set; }

    [Required]
    public string? Type { get; set; }

    public string? PhotoPath { get; set; }
  }
}
