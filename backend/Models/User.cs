using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("Users")]
public class User
{
    [Key] public int UserId { get; set; }
    public int RoleId { get; set; }
    [Required, MaxLength(50)] public string Username { get; set; } = string.Empty;
    [Required, MaxLength(255)] public string PasswordHash { get; set; } = string.Empty;
    [Required, MaxLength(150)] public string FullName { get; set; } = string.Empty;
    [MaxLength(150)] public string? Email { get; set; }
    [MaxLength(20)] public string? Phone { get; set; }
    public bool IsActive { get; set; } = true;
    public byte FailedLoginCount { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; }

    public Role Role { get; set; } = null!;
    public ICollection<UserSession> Sessions { get; set; } = new List<UserSession>();
}
