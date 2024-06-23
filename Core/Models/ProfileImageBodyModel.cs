using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Core.Models
{
    public class ProfileImageBodyModel
    {
    [Required]
    public  string? AccountID { get; set; }

    [Required]
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