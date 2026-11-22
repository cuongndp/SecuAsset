using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("AssetStatusHistories")]
public class AssetStatusHistory
{
    [Key] public int HistoryId { get; set; }
    public int AssetId { get; set; }
    public int? OldStatusId { get; set; }
    public int NewStatusId { get; set; }
    public int? ChangedBy { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    [MaxLength(500)] public string? Note { get; set; }

    public Asset Asset { get; set; } = null!;
    public AssetStatus? OldStatus { get; set; }
    public AssetStatus NewStatus { get; set; } = null!;
    public User? ChangedByUser { get; set; }
}
