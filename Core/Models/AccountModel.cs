using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Core.Models
{
    public class AccountModel
    {
        [Key]
        public string? ID { get; set; }

        [Required, EmailAddress]
        public string? Email {get; set;}

        [Required]
        public string? Password {get; set;}

        [Required]
        public string? Salt {get; set;}

        public string? Token {get; set;}

        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }

        public string? ProfilePhoto {get; set;}
    }
}