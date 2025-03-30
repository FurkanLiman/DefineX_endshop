using System;
using System.ComponentModel.DataAnnotations;

namespace AndShop.ProductService.DTOs
{
    public class ReviewCreateDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        [MaxLength(500)]
        public string Comment { get; set; }

        [MaxLength(100)]
        public string Title { get; set; }
    }

    public class ReviewUpdateDto
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [Required]
        [MaxLength(500)]
        public string Comment { get; set; }

        [MaxLength(100)]
        public string Title { get; set; }
    }

    public class ReviewResponseDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public int Rating { get; set; }
        public string Title { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; }
    }
} 