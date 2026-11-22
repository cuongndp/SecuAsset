using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("AssetStatuses")]
public class AssetStatus
{
    [Key] public int StatusId { get; set; }
    [Required, MaxLength(30)] public string StatusCode { get; set; } = string.Empty;
    [Required, MaxLength(50)] public string StatusName { get; set; } = string.Empty;
    [MaxLength(500)] public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }

    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
}
