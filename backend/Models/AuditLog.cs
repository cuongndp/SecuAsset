using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("AuditLogs")]
public class AuditLog
{
    [Key] public long LogId { get; set; }
    public int? UserId { get; set; }
    [MaxLength(50)] public string? Action { get; set; }
    [MaxLength(100)] public string? EntityName { get; set; }
    [MaxLength(50)] public string? EntityId { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    [MaxLength(45)] public string? IpAddress { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
}
