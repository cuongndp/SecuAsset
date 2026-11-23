using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("Categories")]
public class Category
{
    [Key] public int CategoryId { get; set; }
    [Required, MaxLength(30)] public string CategoryCode { get; set; } = string.Empty;
    [Required, MaxLength(100)] public string CategoryName { get; set; } = string.Empty;
    [MaxLength(500)] public string? Description { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
}
