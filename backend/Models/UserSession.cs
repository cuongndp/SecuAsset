using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("UserSessions")]
public class UserSession
{
    [Key] public Guid SessionId { get; set; } = Guid.NewGuid();
    public int UserId { get; set; }
    [Required, MaxLength(64)] public string RefreshTokenHash { get; set; } = string.Empty;
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    [MaxLength(100)] public string? RevokedReason { get; set; }
    [MaxLength(45)] public string? IpAddress { get; set; }
    [MaxLength(255)] public string? UserAgent { get; set; }
    public DateTime? LastUsedAt { get; set; }

    public User User { get; set; } = null!;
}
