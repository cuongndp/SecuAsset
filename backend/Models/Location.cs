using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("Locations")]
public class Location
{
    [Key] public int LocationId { get; set; }
    [Required, MaxLength(30)] public string LocationCode { get; set; } = string.Empty;
    [Required, MaxLength(100)] public string LocationName { get; set; } = string.Empty;
    public byte? Level { get; set; }
    public int? ParentId { get; set; }
    [MaxLength(500)] public string? Description { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }

    public Location? Parent { get; set; }
    public ICollection<Location> Children { get; set; } = new List<Location>();
    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
}
