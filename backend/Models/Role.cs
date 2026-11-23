using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecuAsset.Api.Models;

[Table("Roles")]
public class Role
{
    [Key] public int RoleId { get; set; }
    [Required, MaxLength(30)] public string RoleCode { get; set; } = string.Empty;
    [Required, MaxLength(100)] public string RoleName { get; set; } = string.Empty;
    [MaxLength(500)] public string? Description { get; set; }
    public bool IsDeleted { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
