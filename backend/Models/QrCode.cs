using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("QRCodes")]
public class QrCode
{
    [Key] public int QRCodeId { get; set; }
    public int AssetId { get; set; }
    [Required, MaxLength(200)] public string QRValue { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
    public DateTime? RevokeAt { get; set; }
    [MaxLength(500)] public string? RevokeReason { get; set; }

    public Asset Asset { get; set; } = null!;
}
