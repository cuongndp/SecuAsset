using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("Attachments")]
public class Attachment
{
    [Key] public int AttachmentId { get; set; }
    public int? AssetId { get; set; }
    public int? RecordId { get; set; }
    public int? UploadedBy { get; set; }
    [Required, MaxLength(255)] public string FileName { get; set; } = string.Empty;
    [Required, MaxLength(500)] public string FilePath { get; set; } = string.Empty;
    [MaxLength(100)] public string? ContentType { get; set; }
    public long FileSize { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }

    public Asset? Asset { get; set; }
    public MaintenanceRecord? Record { get; set; }
    public User? Uploader { get; set; }
}
